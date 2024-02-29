// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri::Manager;

#[tauri::command]
pub fn active_about(name: &str, app_handle: tauri::AppHandle) {
    let msg = format!("Hello, {}! You've been greeted from Rust!", name);
    app_handle.emit_all("greet", msg).unwrap();
}
