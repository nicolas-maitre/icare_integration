use std::{
    collections::hash_map::DefaultHasher,
    fs::read_dir,
    hash::{Hash, Hasher},
};

use serde::{ser::SerializeStruct, Serialize, Serializer};

type FileID = u64;

#[derive(Clone)]
pub struct AnyFile {
    id: FileID,
    name: String,
    file: FileEnum,
}
impl AnyFile {
    fn new_file(id: FileID, name: String, mime_type: String) -> Self {
        Self {
            id,
            name,
            file: FileEnum::File(File { mime_type }),
        }
    }
    fn new_folder(id: FileID, name: String, children: Vec<AnyFile>) -> Self {
        Self {
            id,
            name,
            file: FileEnum::Folder(Folder { children }),
        }
    }
}

impl Serialize for AnyFile {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let struct_len = 4;
        let mut s = serializer.serialize_struct("AnyFile", struct_len)?;
        s.serialize_field("id", &self.id)?;
        s.serialize_field("name", &self.name)?;

        match &self.file {
            FileEnum::File(file) => {
                s.serialize_field("type", "file")?;
                s.serialize_field("mime_type", &file.mime_type)?;
            }
            FileEnum::Folder(folder) => {
                s.serialize_field("type", "folder")?;
                s.serialize_field("children", &folder.children)?;
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

struct File {
    mime_type: String,
}

#[derive(Clone)]
struct Folder {
    children: Vec<AnyFile>,
}

const BASE_FILES_PATH: &str = "/tmp/icare_ged_files";

pub fn get_files_struct(person_id: u32, contract_id: u32) -> Option<Vec<AnyFile>> {
    let path = format!(
        "{}/people/{}/contracts/{}/files",
        BASE_FILES_PATH, person_id, contract_id
    );
    get_sub_files(path.to_owned().as_str())
}

fn get_sub_files(path: &str) -> Option<Vec<AnyFile>> {
    let Ok(res) = read_dir(path) else{
      return None;
  };
    return Some(
        res.map_while({
            |file| {
                let Ok(file) = file else{
          return None;
        };
                let file = file;

                let file_path = file.path();
                let Some(file_path) = file_path.to_str() else {
          return None;
        };

                let mut hasher = DefaultHasher::new();
                file_path.hash(&mut hasher);
                let id = hasher.finish();

                let name = file.file_name();
                let Some(name) = name.to_str() else{
                  return None;
                };
                let name = name.to_string();

                let Ok(file_type) = file.file_type() else{
                  return None;
                };

                if file_type.is_dir() {
                    if let Some(sub_files) = get_sub_files(file_path) {
                        Some(AnyFile::new_folder(id, name, sub_files))
                    } else {
                        None
                    }
                } else {
                    Some(AnyFile::new_file(id, name, "nik".to_string()))
                }
            }
        })
        .collect(),
    );
}
