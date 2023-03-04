use std::{
    collections::hash_map::DefaultHasher,
    fs::{copy, create_dir_all, read_dir, rename},
    hash::{Hash, Hasher},
    path::{Path, PathBuf},
    time::SystemTime,
};

use rocket::response::NamedFile;
use serde::{ser::SerializeMap, Deserialize, Serialize, Serializer};
use urlencoding::encode;

use time::{format_description, OffsetDateTime};

use crate::env::BASE_FILES_PATH;

pub type FileID = u64;

#[derive(Clone, Debug)]
pub struct AnyFile {
    id: FileID,
    name: String,
    url: String,
    file: FileEnum,
}
impl AnyFile {
    fn new_file(id: FileID, name: impl Into<String>, url: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            url: url.into(),
            file: FileEnum::File(File {}),
        }
    }
    fn new_folder(
        id: FileID,
        name: impl Into<String>,
        url: impl Into<String>,
        children: Vec<AnyFile>,
    ) -> Self {
        Self {
            id,
            name: name.into(),
            url: url.into(),
            file: FileEnum::Folder(Folder { children }),
        }
    }
}

impl Serialize for AnyFile {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_map(None)?;
        s.serialize_entry("id", &self.id)?;
        s.serialize_entry("name", &self.name)?;
        s.serialize_entry("url", &self.url)?;

        match &self.file {
            FileEnum::File(_) => {
                s.serialize_entry("type", "file")?;
            }
            FileEnum::Folder(folder) => {
                s.serialize_entry("type", "folder")?;
                s.serialize_entry("children", &folder.children)?;
            }
        };

        s.end()
    }
}

#[derive(Clone, Debug)]
enum FileEnum {
    File(File),
    Folder(Folder),
}
#[derive(Clone, Debug)]

struct File {}

#[derive(Clone, Debug)]
struct Folder {
    children: Vec<AnyFile>,
}

pub fn get_contract_files_struct(person_id: u32, contract_number: u32) -> Option<Vec<AnyFile>> {
    get_sub_files(
        get_base_contract_files_url(person_id, contract_number),
        &get_physical_contract_root(person_id, contract_number).files,
        &PathBuf::new(),
    )
}
pub fn get_family_files_struct(parent_id: u32) -> Option<Vec<AnyFile>> {
    get_sub_files(
        get_base_family_files_url(parent_id),
        &get_physical_family_root(parent_id).files,
        &PathBuf::new(),
    )
}

#[derive(Clone)]
pub struct PhysicalRoot {
    files: PathBuf,
    history: PathBuf,
}
impl PhysicalRoot {
    fn from_base_root(base_root: PathBuf) -> Self {
        Self {
            files: base_root.join("files"),
            history: base_root.join("files_history"),
        }
    }
}

pub fn get_physical_contract_root(person_id: u32, contract_number: u32) -> PhysicalRoot {
    let base_root = Path::new(BASE_FILES_PATH).join(
        [
            "people",
            &person_id.to_string(),
            "contracts",
            &contract_number.to_string(),
        ]
        .iter()
        .collect::<PathBuf>(),
    );
    PhysicalRoot::from_base_root(base_root)
}

pub fn get_physical_family_root(parent_id: u32) -> PhysicalRoot {
    let base_root = Path::new(BASE_FILES_PATH).join(
        ["people", &parent_id.to_string(), "family"]
            .iter()
            .collect::<PathBuf>(),
    );
    PhysicalRoot::from_base_root(base_root)
}
fn get_physical_file_path(physical_files_root: PathBuf, url: String) -> PathBuf {
    let mut clean_url = url;
    for _ in 0..clean_url.len() {
        let char = clean_url.chars().next().unwrap();
        //remove leading / or \
        if char != '/' && char != '\\' {
            break;
        }
        clean_url.remove(0);
    }
    physical_files_root.join(clean_url)
}

fn get_base_contract_files_url(person_id: u32, contract_number: u32) -> String {
    format!(
        "/people/{}/contracts/{}/files_url/",
        person_id, contract_number
    )
}
fn get_base_family_files_url(parent_id: u32) -> String {
    format!("/people/{}/family/files_url/", parent_id)
}

fn get_sub_files(
    base_file_url: String,
    files_root: &PathBuf,
    path: &PathBuf,
) -> Option<Vec<AnyFile>> {
    let physical_path = Path::new(files_root).join(path);
    println!("physical_path {:?}", physical_path.clone());
    let res_dir = match read_dir(physical_path.clone()) {
        Ok(res) => res,
        Err(err) => {
            println!("read dir error: {}", err);
            return None;
        }
    };

    let sub_files = res_dir
        .map_while({
            |file| {
                let Ok(file) = file else{
                    return None;
                };

                let name = file.file_name();
                let Some(name) = name.to_str() else{
                    return None;
                };
                let name = name;

                let file_path = path.join(name);
                let Some(file_path_str) = file_path.to_str() else{
                    return None;
                };

                // "/people/<person_id>/contracts/<contract_number>/file_urls/<file_url>"
                let url = format!("{}{}", base_file_url, encode(file_path_str));

                let mut hasher = DefaultHasher::new();
                url.hash(&mut hasher);
                let id = hasher.finish();

                let Ok(file_type) = file.file_type() else{
                    return None;
                };

                if file_type.is_file() {
                    return Some(AnyFile::new_file(id, name, url));
                }
                if file_type.is_dir() {
                    if let Some(sub_files) =
                        get_sub_files(base_file_url.clone(), files_root, &file_path)
                    {
                        return Some(AnyFile::new_folder(id, name, url, sub_files));
                    }
                }

                None
            }
        })
        .collect();
    return Some(sub_files);
}

pub fn get_contract_file_raw_by_url(
    person_id: u32,
    contract_number: u32,
    url: String,
) -> Result<NamedFile, std::io::Error> {
    let path = get_physical_file_path(
        get_physical_contract_root(person_id, contract_number).files,
        url,
    );
    NamedFile::open(path)
}

pub fn get_family_file_raw_by_url(
    parent_id: u32,
    url: String,
) -> Result<NamedFile, std::io::Error> {
    let path = get_physical_file_path(get_physical_family_root(parent_id).files, url);
    NamedFile::open(path)
}

#[derive(Deserialize, Debug)]
pub struct NewFile {
    r#type: String,
    name: String,
    sub_path: String,
    data_index: Option<u8>,
}

pub fn store_new_file(
    physical_root: PhysicalRoot,
    new_file: &NewFile,
    files_paths: &Vec<PathBuf>,
) -> Result<(), String> {
    //check if new file has data
    if new_file.r#type != "file" {
        return Err(format!("can only add file, not {}", new_file.r#type));
    }
    let Some(new_file_data_index) = new_file.data_index else{
        return Err("missing data index".to_owned());
    };
    let Some(new_file_source_path) = files_paths.get(new_file_data_index as usize) else{
        return Err("missing data".to_owned());
    };

    let file_name = new_file.name.to_owned();
    let file_url = &format!("{}/{}", new_file.sub_path, file_name);
    if file_url.contains("..") {
        return Err("unauthorized".to_owned());
    }

    let physical_files_root = physical_root.files;
    let folder_path =
        &get_physical_file_path(physical_files_root.to_owned(), new_file.sub_path.to_owned());
    let file_path = &get_physical_file_path(physical_files_root, file_url.to_owned());

    //1. check if already a file
    let already_exists = match file_path.try_exists() {
        Ok(e) => e,
        Err(err) => return Err(format!("err exist check: \n{:?} \n{}", file_path, err)),
    };

    //2. move old file to history
    if already_exists {
        let physical_file_history_root = physical_root.history;
        println!("already_exists {:?}", file_path);

        let move_path = &physical_file_history_root.join(
            [
                new_file.sub_path.to_owned(),
                format!("{}-{}", get_fmt_time(), file_name),
            ]
            .iter()
            .collect::<PathBuf>(),
        );
        let history_folder_exists = match physical_file_history_root.try_exists() {
            Ok(e) => e,
            Err(err) => {
                return Err(format!(
                    "err history folder exist check: \n{:?} \n{}",
                    physical_file_history_root, err
                ))
            }
        };
        //TODO: This only works for base-level files and not for deep files
        if !history_folder_exists {
            if let Err(err) = create_dir_all(physical_file_history_root.to_owned()) {
                return Err(format!(
                    "err history folder creation \n{:?}\n{}",
                    physical_file_history_root, err
                ));
            }
        }
        println!("move from {:?} to {:?}", file_path, move_path);
        if let Err(err) = rename(file_path, move_path) {
            return Err(format!(
                "err move old: \n{:?} \n{:?} \n{}",
                file_path, move_path, err
            ));
        }
    }

    //2.5 create dir if not exists
    // folder_path
    let folder_exists = match folder_path.try_exists() {
        Ok(e) => e,
        Err(err) => {
            return Err(format!(
                "err folder exist check: \n{:?} \n{}",
                folder_path, err
            ))
        }
    };
    if !folder_exists {
        if let Err(err) = create_dir_all(folder_path) {
            return Err(format!("err folder creation \n{:?}\n{}", folder_path, err));
        }
    }

    //3. copy new file to real location (from temp directory).
    //Can't use rename because of filesystem limitations.
    if let Err(err) = copy(new_file_source_path, file_path) {
        return Err(format!(
            "err copy new: \n{:?} \n{:?} \n{}",
            new_file_source_path, file_path, err
        ));
    }

    Ok(())

    //4. return dummy AnyFile
    // let url = format!(
    //     "/people/{}/contracts/{}/files_url/{}",
    //     person_id,
    //     contract_number,
    //     encode(&file_url)
    // );
    // let mut hasher = DefaultHasher::new();
    // url.hash(&mut hasher);
    // let id = hasher.finish();
    // return Ok(AnyFile::new_file(id, file_name, url));
}

const DATE_FORMAT_STR: &'static str = "[year]-[month]-[day]-[hour]-[minute]-[second]";
fn get_fmt_time() -> String {
    let dt: OffsetDateTime = SystemTime::now().into();
    let dt_fmt = format_description::parse(DATE_FORMAT_STR).unwrap();
    dt.format(&dt_fmt).unwrap()
}
