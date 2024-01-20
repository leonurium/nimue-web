// To parse this data:
//
//   import { Convert, BaseResponse } from "./file";
//
//   const BaseResponse = Convert.toBaseResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import { string } from "zod";

type BaseDataResponse =
    Timeline |
    TimelinesData |
    CommentsData |
    Preferences |
    BaseLoginData |
    RefreshTokenData |
    User |
    null

export interface BaseResponse {
    success: boolean;
    data: BaseDataResponse;
    message: string;
}

export interface BaseLoginData {
    access_token: string;
    user:         User;
}

export interface RefreshTokenData {
    access_token: string;
}

export interface User {
    user_id:    number;
    device_id:  string;
    email?:     string;
    name:       string;
}

export interface Preferences {
    app_name:                   string;
    version:                    string;
    url_update_version:         string;
    version_ios:                string;
    version_android:            string;
    url_update_version_ios:     string;
    url_update_version_android: string;
    contact_email:              string;
    contact_whatsapp:           string;
    contact_instagram:          string;
    reply_emojis:               string[];
}

export interface TimelinesData {
    page:      number;
    next_page: number;
    timelines: Timeline[];
}

export interface Timeline {
    timeline_id:    number;
    user_id:        number;
    device_id:      string;
    name:           string;
    text_content:   string;
    timed:          string;
    created_at:     string;
    updated_at:     string;
    total_likes:    number;
    total_comments: number;
    total_shares:   number;
    is_liked?:      boolean;
    is_ads:         boolean;
    ads_type?:      string;
    ad_unit_id?:    string;
}

export interface CommentsData {
    page:       number;
    next_page:  number;
    comments:   Comment[];
}

export interface Comment {
    comment_id:     number;
    timeline_id:    number;
    user_id:        number;
    device_id:      string;
    name:           string;
    text_content:   string;
    timed:          string;
    created_at:     string;
    updated_at:     string;
}