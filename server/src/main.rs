use std::collections::HashMap;

use rocket::response::content;
use serde_json::{json, Value};

mod cors;

#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

type FileID = u32;

struct AnyFile {
    id: FileID,
    file: FileEnum,
}
enum FileEnum {
    File(File),
    Folder(Folder),
}
struct File {
    sub_type: String,
}
struct Folder {
    children: Vec<AnyFile>,
}

fn create_file(id: FileID, sub_type: String) -> AnyFile {
    return AnyFile {
        id,
        file: FileEnum::File(File { sub_type }),
    };
}
fn create_folder(id: FileID, children: Vec<AnyFile>) -> AnyFile {
    return AnyFile {
        id,
        file: FileEnum::Folder(Folder { children }),
    };
}

#[get("/contracts/<contract_id>/files")]
fn get_contract_files(contract_id: String) -> String {
    // fn get_contract_files(contract_id: String) -> content::RawJson<String> {
    let static_contracts = HashMap::from([
        (1, create_file(1, "pdf".to_string())),
        (2, create_file(2, "xls".to_string())),
        (
            3,
            create_folder(
                3,
                vec![
                    create_file(4, "pdf".to_string()),
                    create_file(5, "pdf".to_string()),
                ],
            ),
        ),
    ]);

    // return json!(
    //     "{
    //     hello: 1,
    // }"
    // );
    return "yes".to_string();
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(cors::CORS)
        .mount("/", routes![index])
        .mount("/", routes![get_contract_files])
}
