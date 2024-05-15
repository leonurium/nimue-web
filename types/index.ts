import type { User } from "./User";
import type { Timeline, TimelinesData } from "./Timeline"
import type { CommentsData } from "./Comment";
import type { Preferences } from "./Preferences";
import type { Conversation } from "./Conversation";
import type { Chat } from "./Chat";


type BaseDataResponse =
    Timeline |
    TimelinesData |
    CommentsData |
    Preferences |
    BaseLoginData |
    RefreshTokenData |
    User |
    User[] |
    null

export interface BaseResponse {
    success: boolean;
    data: BaseDataResponse;
    message: string;
}

export interface BaseLoginData {
    refresh_token: string;
    access_token: string;
    user:         User;
}

export interface RefreshTokenData {
    access_token: string;
}

export interface RequestConversations {
    user_id: string;
    page: number;
    item_per_page: number;
}

export interface RequestChats {
    conversation_id: string
    page: number
    item_per_page: number
}

export interface ResponseConversations {
    page: number;
    next_page: number | null;
    conversations: Conversation[];
}

export interface ResponseChats {
    page: number;
    next_page: number | null;
    chats: Chat[]
}

export enum TypeMessage {
    action = 'action',
    success = 'success',
    info = 'info',
    warning = 'warning',
    destructive = 'destructive'
}