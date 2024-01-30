import type { User } from "./user";

export interface ChatSession {
    user_id:    string;  //as room also
    user:       User;
    connected:  boolean;
}

export interface ChatMessage {
    from:           string;
    to:             string;
    chat_id:        string;
    content?:       ContentMessage;
    timestamp:      Date;
    is_typing:      boolean;
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