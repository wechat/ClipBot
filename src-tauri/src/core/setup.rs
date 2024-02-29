use tauri::App;
use tauri_plugin_aptabase::EventTracker;

pub type AppError = Box<(dyn std::error::Error + 'static)>;
pub type SetupResult = Result<(), AppError>;

pub fn init(app: &mut App) -> SetupResult {
    // let wind = app.get_window("main").unwrap();
    // wind.open_devtools();
    app.track_event("app_started", None);
    Ok(())
}
