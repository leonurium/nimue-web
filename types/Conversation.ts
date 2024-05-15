import type { Chat } from "./Chat";
import type { User } from "./User";

export interface Conversation {
    conversation_id: string;
    users: User[]
    chats: Chat[]
    last_chat?: string
    last_chat_timestamp?: number
    blocked_by?: string
}