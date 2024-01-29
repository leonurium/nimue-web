<template>
    <div class="flex flex-col h-full overflow-x-auto mb-4">
        <div class="flex flex-col h-full">
            <div v-for="message in messages" class="grid grid-cols-12 gap-y-2">
                <ChatBubble v-if="message.is_typing"
                    :username="message.from.name"
                    :content_message="message.content"
                    :avatar="message.from.avatar"
                    :timestamp="message.timestamp"
                    :is_sender="message.from.user_id == user.user_id"
                    :is_typing="message.is_typing"
                />
                <!-- chat bubble  -->
                <ChatBubble v-else
                    :username="message.from.name"
                    :content_message="message.content"
                    :avatar="message.from.avatar"
                    :timestamp="message.timestamp"
                    :is_sender="message.from.user_id == user.user_id"
                    :is_typing="message.is_typing"
                />
            </div>
        </div>
    </div>
    <ReplyForm :user="user" @onSubmit="handleSendMessage" @onKeypress="handleKeypress" />
</template>
<script lang="ts" setup>
import io from "socket.io-client"
import type { User } from "~/types/user";
import {
    TextMessage,
    type ChatMessage,
    TypeContentMessage,
type ChatRoom
} from "~/types/chat_message"

const socket = io('ws://localhost:3500')

const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const secondUser = ref<User>()
const messages = ref<ChatMessage[]>([])
const chatRooms = ref<ChatRoom[]>([])

const handleSendMessage = (message: string) => {
    const content = new TextMessage(message)
    const chatMessage: ChatMessage = {
        from: user,
        to: user,
        chat_id: generateRandomString(10),
        content: content,
        timestamp: (new Date()),
        is_typing: false
    }

    socket.emit('message', chatMessage)
}

const handleKeypress = () => {
    const chatMessage: ChatMessage = {
        from: user,
        to: user,
        chat_id: generateRandomString(10),
        timestamp: (new Date()),
        is_typing: true
    }
    socket.emit('typing', chatMessage)
}

socket.on('message', (data: ChatMessage) => {
    removeTypingFromMessages()
    messages.value = messages.value.concat(data)
    console.log(messages.value)
})

socket.on('typing', (data: ChatMessage) => {
    if(!typingIsExist()) {
        messages.value = messages.value.concat(data)

        //clear after 3 sec
        setTimeout(() => {
            removeTypingFromMessages()
        }, 3000);
    }
})

function typingIsExist(): boolean {
    const chats = messages.value.filter((message) => {
        if(message.is_typing) {
            return message
        }
    })
    return chats.length > 0
}

function removeTypingFromMessages() {
    const newMessages = messages.value.filter((message) => {
        if(!message.is_typing) {
            return message
        }
    })
    messages.value = newMessages
}

function createChatRoom(users: User[]) {
    const chatRoom: ChatRoom = {
        room_id: generateRandomString(10),
        users: users
    }
    chatRooms.value = chatRooms.value.concat(chatRoom)
}

</script>