import type { User } from "./User";

export interface TimelinesData {
    page:      number;
    next_page: number;
    timelines: Timeline[];
}

export interface Timeline {
    timeline_id:    number;
    user:           User;
    text_content:   string;
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