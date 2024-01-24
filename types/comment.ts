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
    avatar:         string;
    timed:          string;
    created_at:     string;
    updated_at:     string;
}