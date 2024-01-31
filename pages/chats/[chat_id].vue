<template>
    <div class="flex flex-col h-full overflow-x-auto mb-4">
        <div class="flex flex-col h-full">
            <div v-for="message in messages" class="grid grid-cols-12 gap-y-2">
                <!-- typing -->
                <ChatBubble v-if="message.is_typing ?? false" :username="getUserFromSession(message.from)?.name"
                    :avatar="getUserFromSession(message.from)?.avatar" :timestamp="new Date(message.timestamp)"
                    :is_sender="message.from == user.user_id" :is_typing="message.is_typing" />
                <!-- chat bubble from -->
                <ChatBubble v-else :username="getUserFromSession(message.from)?.name" :content_message="message.content"
                    :avatar="getUserFromSession(message.from)?.avatar" :timestamp="new Date(message.timestamp)"
                    :is_sender="message.from == user.user_id" :is_read="message.is_read ?? false"
                    @onRender="handleOnRender(message)" />
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
import { string } from "zod";

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
            chat_id: crypto.randomUUID(),
            content: content,
            timestamp: (new Date()),
            is_read: false
        }

        socket.value?.emit('message', data)
    }
}

const handleKeypress = () => {
    if (secondUser.value) {
        const data: ChatMessage = {
            from: user.user_id,
            to: secondUser.value.user_id,
            chat_id: crypto.randomUUID(),
            timestamp: (new Date()),
            is_typing: true
        }
        socket.value?.emit('typing', data)
    }
}

const handleOnRender = (data: ChatMessage) => {
    if (data.is_read != true && data.from != user.user_id) {
        console.log("handle on render: ", data)
        socket.value?.emit('mark-message-read', data)
    }
}

socket.value?.on('get-messages', (newMessages: ChatMessage[]) => {
    messages.value = newMessages
})

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

socket.value?.on('mark-message-read', (data: ChatMessage) => {
    console.log('mark-message-read', data)
    if (user.user_id == data.from) {
        for (let index = 0; index < messages.value.length; index++) {
            if (messages.value[index].chat_id === data.chat_id) {
                messages.value[index].is_read = true
                console.log("update as read is achieve yeay!")
            }
        }
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
        const is_typing = message.is_typing ?? false
        if (is_typing) {
            return message
        }
    })
    return chats.length > 0
}

function removeTypingFromMessages() {
    const newMessages = messages.value.filter((message) => {
        const is_typing = message.is_typing ?? false
        if (!is_typing) {
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
        if (sessions.value[index].user_id == data.user_id) {
            sessions.value[index].connected = data.connected
            console.log(`${status}`, data.user_id)
        }
    }
}

function handleSocketDisconnect(): void {
    if (socket.value) {
        socket.value.off('get-messages')
        socket.value.off('message')
        socket.value.off('typing')
        socket.value.off('mark-message-read')
        socket.value.off('user-joined')
        socket.value.off('user-disconnected')
        socket.value.offAny()
        socket.value.disconnect()
        console.log('cleanup')
    }
}

onBeforeRouteLeave(() => {
    console.log('onBeforeRouteLeave')
    handleSocketDisconnect()
})

onBeforeUnmount(() => {
    console.log('onBeforeUnmount')
    handleSocketDisconnect()
})

onMounted(() => {
    if (socket.value && !socket.value.connected) {
        console.log('try to connecting')
        socket.value.connect()
    }
})


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
                sessions.value = []
                sessions.value.push({
                    user_id: user.user_id,
                    user: user,
                    connected: true
                }, {
                    user_id: secondUser.value.user_id,
                    user: secondUser.value,
                    connected: true
                })
                socket.value?.emit('request-messages', ({ user_id: secondUser.value.user_id }))
            }
        })
})

</script>