use std::{
    collections::hash_map::DefaultHasher,
    fs::read_dir,
    hash::{Hash, Hasher},
    path::{Path, PathBuf},
};

use rocket::response::NamedFile;
use serde::{ser::SerializeMap, Serialize, Serializer};
use urlencoding::encode;

type FileID = u64;

#[derive(Clone)]
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

#[derive(Clone)]
enum FileEnum {
    File(File),
    Folder(Folder),
}
#[derive(Clone)]

struct File {}

#[derive(Clone)]
struct Folder {
    children: Vec<AnyFile>,
}

const BASE_FILES_PATH: &str = "/tmp/icare_ged_files";

pub fn get_files_struct(person_id: u32, contract_id: u32) -> Option<Vec<AnyFile>> {
    get_sub_files(&get_folder_path(person_id, contract_id))
}

fn get_folder_path(person_id: u32, contract_id: u32) -> PathBuf {
    [
        "people",
        &person_id.to_string(),
        "contracts",
        &contract_id.to_string(),
        "files",
    ]
    .iter()
    .collect()
}
fn get_physical_file_path(person_id: u32, contract_id: u32, url: String) -> PathBuf {
    Path::new(BASE_FILES_PATH).join(url)
}

fn get_sub_files(path: &PathBuf) -> Option<Vec<AnyFile>> {
    let physical_path = Path::new(BASE_FILES_PATH).join(path);
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

                let mut hasher = DefaultHasher::new();
                file_path_str.hash(&mut hasher);
                let id = hasher.finish();

                // "/people/<person_id>/contracts/<contract_id>/file_urls/<file_url>"
                let url = format!("/people/0/contracts/0/file_urls/{}", encode(file_path_str));

                let Ok(file_type) = file.file_type() else{
                    return None;
                };

                if file_type.is_file() {
                    return Some(AnyFile::new_file(id, name, url));
                }
                if file_type.is_dir() {
                    if let Some(sub_files) = get_sub_files(&file_path) {
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