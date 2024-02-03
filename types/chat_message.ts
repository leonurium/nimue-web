import type { User } from "./user";

export interface ChatSession {
    user_id:    string;  //as room also
    user?:      User;
    connected:  boolean;
    messages?:  ChatMessage[];
}

export interface ResponseChatMessage {
    page: number;
    next_page: number;
    messages: ChatMessage[];
}

export interface ChatMessage {
    from:           string;
    to:             string;
    chat_id:        string;
    content?:       ContentMessage;
    timestamp:      Date;
    is_typing?:     boolean;
    is_read?:       boolean;
}

export interface ContentMessage {
    type: TypeContentMessage;
}

export enum TypeContentMessage {
    text = 'text',
    image = 'image',
    audio = 'audio'
}

export class TextMessage implements ContentMessage {
    type: TypeContentMessage = TypeContentMessage.text
    text: string;

    constructor(text: string) {
        this.text = text
    }
}

export class ImageMessage implements ContentMessage {
    type: TypeContentMessage = TypeContentMessage.image
    url_image: string;

    constructor(url_image: string) {
        this.url_image = url_image
    }
}