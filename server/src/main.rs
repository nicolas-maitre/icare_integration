#![feature(proc_macro_hygiene, decl_macro)]

use std::path::PathBuf;

use files::{
    get_contract_files_struct, get_family_files_struct, get_person_files_struct,
    get_physical_contract_root, get_physical_family_root, get_physical_file_path,
    get_physical_person_root, store_new_file, AnyFile, NewFile, PhysicalRoot,
};
use rocket::{
    config,
    http::{ContentType, Status},
    response::{status, NamedFile},
    Config, Data,
};
use rocket_contrib::json::Json;
use rocket_multipart_form_data::{
    MultipartFormData, MultipartFormDataField, MultipartFormDataOptions, Repetition,
};
use serde::Serialize;
mod cors;
mod env;
mod files;

#[macro_use]
extern crate rocket;

#[get("/people/<person_id>/contracts/<contract_id>/files")]
fn get_contract_files(person_id: u32, contract_id: u32) -> Result<Json<Vec<AnyFile>>, Status> {
    if let Some(res) = get_contract_files_struct(person_id, contract_id) {
        Ok(Json(res))
    } else {
        Ok(Json(vec![]))
    }
}

#[get("/people/<person_id>/files")]
fn get_person_files(person_id: u32) -> Result<Json<Vec<AnyFile>>, Status> {
    if let Some(res) = get_person_files_struct(person_id) {
        Ok(Json(res))
    } else {
        Ok(Json(vec![]))
    }
}

#[get("/people/<parent_id>/family/files")]
fn get_family_files(parent_id: u32) -> Result<Json<Vec<AnyFile>>, Status> {
    if let Some(res) = get_family_files_struct(parent_id) {
        Ok(Json(res))
    } else {
        Ok(Json(vec![]))
    }
}

#[post(
    "/people/<person_id>/contracts/<contract_number>/files",
    data = "<data>"
)]
fn new_contract_files(
    content_type: &ContentType,
    data: Data,
    person_id: u32,
    contract_number: u32,
) -> Result<status::Created<Json<NewFilesResponse>>, Status> {
    handle_file_upload(
        get_physical_contract_root(person_id, contract_number),
        content_type,
        data,
    )
}

#[post("/people/<person_id>/files", data = "<data>")]
fn new_person_files(
    content_type: &ContentType,
    data: Data,
    person_id: u32,
) -> Result<status::Created<Json<NewFilesResponse>>, Status> {
    handle_file_upload(get_physical_person_root(person_id), content_type, data)
}

#[post("/people/<parent_id>/family/files", data = "<data>")]
fn new_family_files(
    content_type: &ContentType,
    data: Data,
    parent_id: u32,
) -> Result<status::Created<Json<NewFilesResponse>>, Status> {
    handle_file_upload(get_physical_family_root(parent_id), content_type, data)
}

const FILES_FORM_FIELD: &str = "files";
const FILES_JSON_FORM_FIELD: &str = "files_json";
const MAX_FILES_SIZE: u64 = 128 * 1024 * 1024; //128 mb

#[derive(Serialize)]
struct NewFilesResponse {
    // created: Vec<>,
    created_count: usize,
    errors: Vec<String>,
}

fn handle_file_upload(
    physical_root: PhysicalRoot,
    content_type: &ContentType,
    data: Data,
) -> Result<status::Created<Json<NewFilesResponse>>, Status> {
    let fields_config = MultipartFormDataOptions::with_multipart_form_data_fields(vec![
        MultipartFormDataField::file(FILES_FORM_FIELD)
            .size_limit(MAX_FILES_SIZE)
            // .content_type_by_string(Some(mime::APPLICATION_PDF))
            // .unwrap()
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
    let files_paths: Vec<PathBuf> = files.iter().map(|ff| ff.path.to_owned()).collect();

    let Some(files_json) = multipart_form_data
        .texts
        .get(FILES_JSON_FORM_FIELD)
        .and_then(|tfv| tfv.get(0))
        .and_then(|tf| Some(tf.text.clone()))
    else {
        println!("err: no '{}'", FILES_JSON_FORM_FIELD);
        return Err(Status::BadRequest);
    };

    let files_info_vec = match serde_json::from_str::<Vec<NewFile>>(&files_json) {
        Ok(v) => v,
        Err(err) => {
            println!("parse err {}", err);
            return Err(Status::BadRequest);
        }
    };

    let results = files_info_vec
        .iter()
        .map(|file| store_new_file(physical_root.to_owned(), file, &files_paths));

    //handle errors:
    {
        let (created, errors): (Vec<Option<()>>, Vec<Option<String>>) = results
            .map(|res| match res {
                Ok(res) => (Some(res), None),
                Err(err) => (None, Some(err.to_string())),
            })
            .unzip();

        let created_count = created.into_iter().filter(|c| c.is_some()).count();

        let errors: Vec<String> = errors
            .into_iter()
            .filter(|e| e.is_some())
            .map(|e| e.unwrap())
            .collect();

        Ok(status::Created(
            "".to_string(),
            Some(Json(NewFilesResponse {
                errors,
                created_count,
            })),
        ))
    }
}

//could directly get a pathBuffer from url
#[get("/people/<person_id>/contracts/<contract_number>/files_url/<files_url>")]
fn get_contract_file_raw_by_url(
    person_id: u32,
    contract_number: u32,
    files_url: String,
) -> Result<NamedFile, Status> {
    let path = get_physical_file_path(
        get_physical_contract_root(person_id, contract_number).files,
        files_url,
    );
    if let Ok(res) = NamedFile::open(path) {
        Ok(res)
    } else {
        Err(Status::NotFound)
    }
}

//could directly get a pathBuffer from url
#[get("/people/<person_id>/files_url/<files_url>")]
fn get_person_file_raw_by_url(person_id: u32, files_url: String) -> Result<NamedFile, Status> {
    let path = get_physical_file_path(get_physical_person_root(person_id).files, files_url);
    if let Ok(res) = NamedFile::open(path) {
        Ok(res)
    } else {
        Err(Status::NotFound)
    }
}

//could directly get a pathBuffer from url
#[get("/people/<parent_id>/family/files_url/<files_url>")]
fn get_family_file_raw_by_url(parent_id: u32, files_url: String) -> Result<NamedFile, Status> {
    let path = get_physical_file_path(get_physical_family_root(parent_id).files, files_url);
    if let Ok(res) = NamedFile::open(path) {
        Ok(res)
    } else {
        Err(Status::NotFound)
    }
}

fn main() {
    let rocket_cfg = Config::build(config::Environment::Development)
        .address("127.0.0.1")
        .unwrap();

    println!("using file root: {}", env::BASE_FILES_PATH);

    rocket::custom(rocket_cfg)
        .attach(cors::CORS)
        .mount(
            "/",
            routes![
                //contract
                get_contract_files,
                get_contract_file_raw_by_url,
                new_contract_files,
                //person
                get_person_files,
                get_person_file_raw_by_url,
                new_person_files,
                //family
                get_family_files,
                get_family_file_raw_by_url,
                new_family_files
            ],
        )
        .launch();
}
