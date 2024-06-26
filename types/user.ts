export interface User {
    user_id:    string;
    device_id:  string;
    email?:     string;
    name:       string;
    avatar:     string;
    is_online?: boolean;
    fcm_token?: string;
}