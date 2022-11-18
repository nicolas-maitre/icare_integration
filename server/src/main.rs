#![feature(proc_macro_hygiene, decl_macro)]

use std::collections::HashMap;

use rocket::{config, http::Status, Config};
use rocket_contrib::json::Json;
use serde::{ser::SerializeStruct, Deserialize, Serialize, Serializer};
mod cors;

#[macro_use]
extern crate rocket;

#[derive(Debug, Serialize, Deserialize)]
pub struct TestReturn {
    pub id: i32,
    pub name: String,
}

#[get("/")]
fn index() -> Result<Json<TestReturn>, Status> {
    Ok(Json(TestReturn {
        id: 42,
        name: s("Hello World"),
    }))
}

type FileID = u32;

#[derive(Clone)]
struct AnyFile {
    id: FileID,
    name: String,
    file: FileEnum,
}
impl AnyFile {
    fn file(id: FileID, name: String, mime_type: String) -> Self {
        Self {
            id,
            name,
            file: FileEnum::File(File { mime_type }),
        }
    }
    fn folder(id: FileID, name: String, children: Vec<AnyFile>) -> Self {
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
                s.serialize_field("subType", &file.mime_type)?;
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

#[get("/people/<person_id>/contracts/<contract_id>/files")]
fn get_contract_files(person_id: i32, contract_id: i32) -> Result<Json<Vec<AnyFile>>, Status> {
    //map->person_id->contract_id->contract
    let static_contracts = HashMap::from([
        (
            1,
            HashMap::from([(
                1,
                vec![
                    AnyFile::file(1, s("import.pdf"), s("pdf")),
                    AnyFile::file(2, s("yes.pdf"), s("pdf")),
                    AnyFile::folder(
                        3,
                        s("folder"),
                        vec![
                            AnyFile::file(4, s("plus.xls"), s("xls")),
                            AnyFile::file(5, s("moins.pdf"), s("pdf")),
                        ],
                    ),
                ],
            )]),
        ),
        (
            74104,
            HashMap::from([(
                005,
                vec![
                    AnyFile::file(2, s("yes.pdf"), s("pdf")),
                    AnyFile::folder(
                        3,
                        s("folder"),
                        vec![
                            AnyFile::file(4, s("plus.xls"), s("xls")),
                            AnyFile::file(5, s("moins.pdf"), s("pdf")),
                        ],
                    ),
                    AnyFile::file(1, s("export.pdf"), s("pdf")),
                ],
            )]),
        ),
    ]);

    if let Some(res) = (|| static_contracts.get(&person_id)?.get(&contract_id))() {
        Ok(Json(res.to_vec()))
    } else {
        Err(Status::NotFound)
    }
}

fn main() {
    let rocket_cfg = Config::build(config::Environment::Development)
        .address("127.0.0.1")
        .unwrap();

    rocket::custom(rocket_cfg)
        .attach(cors::CORS)
        .mount("/", routes![index])
        .mount("/", routes![get_contract_files])
        .launch();
}

fn s(str: &str) -> String {
    str.to_string()
}
