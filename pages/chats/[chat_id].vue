<template>
    <div class="flex flex-col h-full overflow-x-auto mb-4">
        <div class="flex flex-col h-full">
            <div v-for="message in messages" class="grid grid-cols-12 gap-y-2">
                <!-- typing -->
                <ChatBubble v-if="message.is_typing" :username="getUserFromSession(message.from)?.name"
                    :content_message="message.content" :avatar="getUserFromSession(message.from)?.avatar"
                    :timestamp="message.timestamp.toTimeString" :is_sender="message.from == user.user_id"
                    :is_typing="message.is_typing" />
                <!-- chat bubble from -->
                <ChatBubble v-else :username="getUserFromSession(message.from)?.name"
                    :content_message="message.content" :avatar="getUserFromSession(message.from)?.avatar"
                    :timestamp="message.timestamp.toTimeString" :is_sender="message.from == user.user_id"
                    :is_typing="message.is_typing" />
            </div>
        </div>
    </div>
    <ReplyForm :user="user" @onSubmit="handleSendMessage" @onKeypress="handleKeypress" />
</template>
<script lang="ts" setup>
import type { User } from "~/types/user";
import {
    TextMessage,
    type ChatMessage,
    type ChatSession
} from "~/types/chat_message"

definePageMeta({
    middleware: 'socket'
})

const socket = useSocket()
const { chat_id } = useRoute().params
const { getUserById } = useUserService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const secondUser = ref<User>()
const messages = ref<ChatMessage[]>([])
const sessions = ref<ChatSession[]>([])

const handleSendMessage = (message: string) => {
    if (secondUser.value) {
        const content = new TextMessage(message)
        const data: ChatMessage = {
            from: user.user_id,
            to: secondUser.value.user_id,
            chat_id: generateRandomString(10),
            content: content,
            timestamp: (new Date()),
            is_typing: false
        }

        socket.value?.emit('message', data)
    }
}

const handleKeypress = () => {
    if (secondUser.value) {
        const data: ChatMessage = {
            from: user.user_id,
            to: secondUser.value.user_id,
            chat_id: generateRandomString(10),
            timestamp: (new Date()),
            is_typing: true
        }
        socket.value?.emit('typing', data)
    }
}

socket.value?.on('message', (data: ChatMessage) => {
    removeTypingFromMessages()
    messages.value = messages.value.concat(data)
    console.log(messages.value)
})

socket.value?.on('typing', (data: ChatMessage) => {
    if (!typingIsExist()) {
        messages.value = messages.value.concat(data)

        //clear after 3 sec
        setTimeout(() => {
            removeTypingFromMessages()
        }, 3000);
    }
})

socket.value?.on('user-joined', (data: ChatSession) => {
    // update user in online / connected
    updateStatusUser(data, "user-online: ")
})

socket.value?.on('user-disconnected', (data: ChatSession) => {
    // update user is offline / disconnected
    updateStatusUser(data, "user-offline: ")
})

function typingIsExist(): boolean {
    const chats = messages.value.filter((message) => {
        if (message.is_typing) {
            return message
        }
    })
    return chats.length > 0
}

function removeTypingFromMessages() {
    const newMessages = messages.value.filter((message) => {
        if (!message.is_typing) {
            return message
        }
    })
    messages.value = newMessages
}

function getUserFromSession(user_id: string): User | undefined {
    const session = sessions.value.find((session) => session.user_id === user_id)
    return session?.user || undefined
}

function updateStatusUser(data: ChatSession, status: string) {
    for (let index = 0; index < sessions.value.length; index++) {
        if(sessions.value[index].user_id == data.user_id) {
            sessions.value[index].connected = data.connected
            console.log(`${status}`, data.user_id)
        }
    }
}

onBeforeMount(async () => {
    const user_id = String(chat_id)
    await getUserById(user_id)
        .then((result) => {
            const data = result as User
            secondUser.value = data
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            if (secondUser.value) {
                const session1: ChatSession = {
                    user_id: user.user_id,
                    user: user,
                    connected: true
                }
                const session2: ChatSession = {
                    user_id: secondUser.value.user_id,
                    user: secondUser.value,
                    connected: true
                }
                sessions.value = []
                sessions.value.push(session1, session2)
                socket.value?.emit('join-room', { room: secondUser.value.user_id })
                socket.value?.emit('join-room', { room: user.user_id })
            }
        })
})

</script>