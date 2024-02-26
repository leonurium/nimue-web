export interface Preferences {
    app_name?:                   string;
    version?:                    string;
    url_update_version?:         string;
    version_ios?:                string;
    version_android?:            string;
    url_update_version_ios?:     string;
    url_update_version_android?: string;
    reply_emojis?:               string[];
    report_reasons?:             string[];
    images?:                     ImagePreferences;
    urls?:                       UrlPreferences;
    contacts?:                   ContactPreferences;
}

export interface ImagePreferences {
    image_url_login?:            string;
    image_url_register?:         string;
    image_url_login_lg?:         string;
    image_url_register_lg?:      string;
}

export interface UrlPreferences {
    socket_server?:     string;
    privacy_policy?:    string;
    user_agreement?:    string;
}

export interface ContactPreferences {
    email?:     string;
    instagram?: string;
}