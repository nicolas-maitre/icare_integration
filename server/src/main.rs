#![feature(proc_macro_hygiene, decl_macro)]

use files::{get_file_raw_by_url, get_files_struct, AnyFile};
use rocket::{
    config,
    http::{ContentType, Status},
    response::NamedFile,
    Config, Data,
};
use rocket_contrib::json::Json;
use rocket_multipart_form_data::{
    mime, MultipartFormData, MultipartFormDataField, MultipartFormDataOptions, Repetition,
};
use serde::{Deserialize, Serialize};
mod cors;
mod env;
mod files;

#[macro_use]
extern crate rocket;

#[get("/people/<person_id>/contracts/<contract_id>/files")]
fn get_contract_files(person_id: u32, contract_id: u32) -> Result<Json<Vec<AnyFile>>, Status> {
    if let Some(res) = get_files_struct(person_id, contract_id) {
        Ok(Json(res))
    } else {
        Ok(Json(vec![]))
    }
}
#[post("/people/<person_id>/contracts/<contract_id>/files", data = "<data>")]
fn new_contract_files(
    content_type: &ContentType,
    data: Data,
    person_id: u32,
    contract_id: u32,
) -> Result<String, Status> {
    new_contract_files_fn(content_type, data, person_id, contract_id)
}

const FILES_FORM_FIELD: &str = "files";
const FILES_JSON_FORM_FIELD: &str = "files_json";

#[derive(Deserialize, Debug)]
struct NewFile {
    r#type: String,
    name: String,
}

fn new_contract_files_fn(
    content_type: &ContentType,
    data: Data,
    person_id: u32,
    contract_id: u32,
) -> Result<String, Status> {
    let fields_config = MultipartFormDataOptions::with_multipart_form_data_fields(vec![
        MultipartFormDataField::file(FILES_FORM_FIELD)
            .content_type_by_string(Some(mime::APPLICATION_PDF))
            .unwrap()
            .repetition(Repetition::infinite()),
        MultipartFormDataField::text(FILES_JSON_FORM_FIELD),
    ]);

    let multipart_form_data = match MultipartFormData::parse(content_type, data, fields_config) {
        Ok(m) => m,
        Err(err) => {
            println!("Err {}", err);
            return Err(Status::BadRequest);
        }
    };

    let Some(files) = multipart_form_data.files.get(FILES_FORM_FIELD) else {
        println!("err: no '{}'", FILES_FORM_FIELD);
        return Err(Status::BadRequest);
    };

    let Some(files_json) = multipart_form_data
        .texts
        .get(FILES_JSON_FORM_FIELD)
        .and_then(|tfv| tfv.get(0))
        .and_then(|tf| Some(tf.text.clone()))
    else {
        println!("err: no '{}'", FILES_JSON_FORM_FIELD);
        return Err(Status::BadRequest);
    };

    let file_names: Vec<String> = files.iter().map_while(|f| f.file_name.clone()).collect();
    let files_info_vec = match serde_json::from_str::<Vec<NewFile>>(&files_json) {
        Ok(v) => v,
        Err(err) => {
            println!("parse err {}", err);
            return Err(Status::BadRequest);
        }
    };

    Ok(format!(
        "file_names: {:?}\nfile_infos_vec: {:?}",
        file_names, files_info_vec
    ))
}

#[get("/people/<person_id>/contracts/<contract_id>/files_url/<files_url>")]
fn get_contract_file_raw_by_url(
    person_id: u32,
    contract_id: u32,
    files_url: String,
) -> Result<NamedFile, Status> {
    if let Ok(res) = get_file_raw_by_url(person_id, contract_id, files_url) {
        Ok(res)
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
        .mount(
            "/",
            routes![
                get_contract_files,
                get_contract_file_raw_by_url,
                new_contract_files
            ],
        )
        .launch();
}
