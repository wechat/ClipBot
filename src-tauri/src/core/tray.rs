use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

pub fn menu() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "退出");
    let show = CustomMenuItem::new("show".to_string(), "显示");
    let hide = CustomMenuItem::new("hide".to_string(), "隐藏");
    let about = CustomMenuItem::new("about".to_string(), "关于 ClipBot");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(show)
        .add_item(hide)
        .add_item(about);

    SystemTray::new().with_menu(tray_menu)
}

pub fn handler(app: &AppHandle, event: SystemTrayEvent) {
    let wind = app.get_window("main").unwrap();
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            #[cfg(not(target_os = "macos"))]
            {
                wind.show().unwrap();
            }
            #[cfg(target_os = "macos")]
            {
                tauri::AppHandle::show(&wind.app_handle()).unwrap();
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "show" => {
                #[cfg(not(target_os = "macos"))]
                {
                    wind.show().unwrap();
                }
                #[cfg(target_os = "macos")]
                {
                    tauri::AppHandle::show(&wind.app_handle()).unwrap();
                }
            }
            "hide" => {
                #[cfg(not(target_os = "macos"))]
                {
                    wind.hide().unwrap();
                }
                #[cfg(target_os = "macos")]
                {
                    tauri::AppHandle::hide(&wind.app_handle()).unwrap();
                }
            }
            "about" => {
                #[cfg(not(target_os = "macos"))]
                {
                    wind.show().unwrap();
                }
                #[cfg(target_os = "macos")]
                {
                    tauri::AppHandle::show(&wind.app_handle()).unwrap();
                }
                // 发送事件到前端
                wind.emit("active_about", Some("")).unwrap();
            }
            _ => {
                println!("Unknown menu item: {}", id);
            }
        },
        _ => {}
    }
}
