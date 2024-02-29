// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{generate_context, generate_handler, Builder, Manager};
use tauri_plugin_aptabase::EventTracker;
use tauri_plugin_clipboard;

mod core;

fn main() {
    Builder::default()
        .setup(core::setup::init)
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_aptabase::Builder::new("A-EU-3734469748").build())
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                #[cfg(not(target_os = "macos"))]
                {
                    event.window().hide().unwrap();
                }
                #[cfg(target_os = "macos")]
                {
                    tauri::AppHandle::hide(&event.window().app_handle()).unwrap();
                }
                api.prevent_close();
            }
            _ => {}
        })
        .system_tray(core::tray::menu())
        .on_system_tray_event(core::tray::handler)
        .invoke_handler(generate_handler![core::cmd::active_about])
        .build(generate_context!())
        .expect("error while running tauri application")
        .run(|handler, event| match event {
            tauri::RunEvent::Exit { .. } => {
                handler.track_event("app_exited", None);
                handler.flush_events_blocking();
            }
            _ => {}
        })
}
