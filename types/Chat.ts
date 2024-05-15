import type { TextContentChat, ImageContentChat, AudioContentChat } from "./ContentChat";
import type { User } from "./User"

export interface Chat {
    chat_id: string;
    conversation_id: string;
    from: User;
    to: User;
    content?: TextContentChat | ImageContentChat | AudioContentChat | undefined | null ;
    is_typing?: boolean;
    is_read?: boolean;
    created_at: number;
}