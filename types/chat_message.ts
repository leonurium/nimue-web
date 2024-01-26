import type { User } from "./user";

export interface ChatMessage {
    user:           User;
    chat_id:        string;
    content?:       ContentMessage;
    timestamp:      Date;
    is_typing:      boolean;
}

export interface ChatRoom {
    room_id:    string;
    users:      User[];
}

export interface ContentMessage {
    type: TypeContentMessage;
}

export enum TypeContentMessage {
    text = 'text',
    audio = 'audio'
}

export class TextMessage implements ContentMessage {
    type: TypeContentMessage = TypeContentMessage.text
    text: string;

    constructor(text: string) {
        this.text = text
    }
}