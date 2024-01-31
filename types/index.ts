import type { User } from "./user";
import type { Timeline, TimelinesData } from "./timeline"
import type { CommentsData } from "./comment";
import type { Preferences } from "./preferences";


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
    access_token: string;
    user:         User;
}

export interface RefreshTokenData {
    access_token: string;
}

export enum TypeMessage {
    action = 'action',
    success = 'success',
    info = 'info',
    warning = 'warning',
    destructive = 'destructive'
}