use std::{
    collections::hash_map::DefaultHasher,
    fs::{read_dir, rename},
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

pub fn get_files_struct(person_id: u32, contract_id: u32) -> Option<Vec<AnyFile>> {
    get_sub_files(
        person_id,
        contract_id,
        &get_physical_contract_files_root(person_id, contract_id),
        &PathBuf::new(),
    )
}

fn get_physical_contract_files_root(person_id: u32, contract_id: u32) -> PathBuf {
    Path::new(BASE_FILES_PATH).join(
        [
            "people",
            &person_id.to_string(),
            "contracts",
            &contract_id.to_string(),
            "files",
        ]
        .iter()
        .collect::<PathBuf>(),
    )
}
fn get_physical_contract_files_history_root(person_id: u32, contract_id: u32) -> PathBuf {
    Path::new(BASE_FILES_PATH).join(
        [
            "people",
            &person_id.to_string(),
            "contracts",
            &contract_id.to_string(),
            "files_history",
        ]
        .iter()
        .collect::<PathBuf>(),
    )
}

fn get_physical_file_path(person_id: u32, contract_id: u32, url: String) -> PathBuf {
    get_physical_contract_files_root(person_id, contract_id).join(url)
}

fn get_sub_files(
    person_id: u32,
    contract_id: u32,
    files_root: &PathBuf,
    path: &PathBuf,
) -> Option<Vec<AnyFile>> {
    let physical_path = Path::new(files_root).join(path);
    let Ok(res) = read_dir(physical_path) else{
      return None;
    };
    let sub_files = res
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

                // "/people/<person_id>/contracts/<contract_id>/file_urls/<file_url>"
                let url = format!(
                    "/people/{}/contracts/{}/files_url/{}",
                    person_id,
                    contract_id,
                    encode(file_path_str)
                );

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
                        get_sub_files(person_id, contract_id, files_root, &file_path)
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

pub fn get_file_raw_by_url(
    person_id: u32,
    contract_id: u32,
    url: String,
) -> Result<NamedFile, std::io::Error> {
    let path = get_physical_file_path(person_id, contract_id, url);
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
    person_id: u32,
    contract_id: u32,
    new_file: &NewFile,
    files_paths: &Vec<PathBuf>,
) -> Result<AnyFile, String> {
    //check if new file has data
    if new_file.r#type != "file" {
        return Err(format!("can only add file, not {}", new_file.r#type));
    }
    let Some(new_file_data_index) = new_file.data_index else{
        return Err("missing data index".to_string());
    };
    let Some(new_file_source_path) = files_paths.get(new_file_data_index as usize) else{
        return Err("missing data".to_string());
    };

    let file_name = new_file.name.to_owned();
    let file_url = &format!("{}/{}", new_file.sub_path, file_name);
    if (file_url.contains("..")).to_owned() {
        return Err("unauthorized".to_string());
    }
    let file_path = &get_physical_file_path(person_id, contract_id, file_url.to_owned());

    //1. check if already a file
    let already_exists = match file_path.try_exists() {
        Ok(e) => e,
        Err(err) => return Err(format!("err exist check: \n{:?} \n{}", file_path, err)),
    };

    //2. move old file to history
    if already_exists {
        let move_path = &get_physical_contract_files_history_root(person_id, contract_id).join(
            [format!("{}-{}", get_fmt_time(), file_name)]
                .iter()
                .collect::<PathBuf>(),
        );
        if let Err(err) = rename(file_path, move_path) {
            return Err(format!(
                "err move old: \n{:?} \n{:?} \n{}",
                file_path, move_path, err
            ));
        }
    }

    //3. move new file to real location
    if let Err(err) = rename(new_file_source_path, file_path) {
        return Err(format!(
            "err move new: \n{:?} \n{:?} \n{}",
            new_file_source_path, file_path, err
        ));
    }

    //4. return dummy AnyFile
    let url = format!(
        "/people/{}/contracts/{}/files_url/{}",
        person_id,
        contract_id,
        encode(&file_url)
    );
    let mut hasher = DefaultHasher::new();
    url.hash(&mut hasher);
    let id = hasher.finish();
    return Ok(AnyFile::new_file(id, file_name, url));
}

const DATE_FORMAT_STR: &'static str = "[year]-[month]-[day]-[hour]-[minute]-[second]";
fn get_fmt_time() -> String {
    let dt: OffsetDateTime = SystemTime::now().into();
    let dt_fmt = format_description::parse(DATE_FORMAT_STR).unwrap();
    dt.format(&dt_fmt).unwrap()
}
