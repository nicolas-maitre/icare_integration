#![feature(proc_macro_hygiene, decl_macro)]

use files::{get_file_raw_by_url, get_files_struct, AnyFile};
use rocket::{config, http::Status, response::NamedFile, Config};
use rocket_contrib::json::Json;
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
            routes![get_contract_files, get_contract_file_raw_by_url],
        )
        .launch();
}
