<template>
    <NuxtLayout :session="getSessionOtherUser(secondUser)" name="chat">
        <div class="flex flex-col overflow-scroll h-[calc(100svh-56px-56px-76px-12px)]">
            <!-- loading -->
            <LoadingSpinner v-if="loading" class="w-full h-16" />
            <Observer @intersect="getMessages()" />
            <div v-for="message in messages" class="grid grid-cols-12 gap-y-2">
                <!-- typing -->
                <ChatBubble v-if="message.is_typing ?? false" :username="getUserFromSession(message.from)?.name"
                    :avatar="getUserFromSession(message.from)?.avatar" :timestamp="new Date(message.created_at)"
                    :is_sender="message.from == user.user_id" :is_typing="message.is_typing" />
                <!-- chat bubble from -->
                <ChatBubble v-else :key="message.message_id" :username="getUserFromSession(message.from)?.name"
                    :content_message="message.content" :avatar="getUserFromSession(message.from)?.avatar"
                    :timestamp="new Date(message.created_at)" :is_sender="message.from == user.user_id"
                    :is_read="message.is_read ?? false" @onRender="handleOnRender(message)" />
            </div>
        </div>
        <ReplyForm class="sticky bottom-14 border-t" :user="user" @onSubmit="handleSendMessage" @onKeypress="handleKeypress"
            @onUpload="handleUpload" withImageUpload />
    </NuxtLayout>
</template>
<script lang="ts" setup>
import type { User } from "~/types/user";
import {
    ImageMessage,
    TextMessage,
    type ChatMessage,
    type ChatSession,
    type ResponseChatMessage
} from "~/types/chat_message"

definePageMeta({
    layout: false
})

const { chat_id } = useRoute().params
const { socket, authSocket } = useSocket()
const { getUserById } = useUserService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const secondUser = ref<User>()
const messages = ref<ChatMessage[]>([])
const sessions = ref<ChatSession[]>([])
const page = ref<number>(1)
const itemPerPage: number = 10
const loading = ref<boolean>(true)

const handleSendMessage = (message: string) => {
    if (secondUser.value) {
        const content = new TextMessage(message)
        const data: ChatMessage = {
            from: user.user_id,
            to: secondUser.value.user_id,
            message_id: crypto.randomUUID(),
            content: content,
            created_at: (new Date()),
            is_read: false
        }

        socket().emit('message', data)
    }
}

const handleUpload = (value: string) => {
    if (secondUser.value) {
        const image_url = value
        const content = new ImageMessage(image_url)
        const data: ChatMessage = {
            from: user.user_id,
            to: secondUser.value.user_id,
            message_id: crypto.randomUUID(),
            content: content,
            created_at: (new Date()),
            is_read: false
        }

        socket().emit('message', data)
    }    
}

const handleKeypress = () => {
    if (secondUser.value) {
        const data: ChatMessage = {
            from: user.user_id,
            to: secondUser.value.user_id,
            message_id: crypto.randomUUID(),
            created_at: (new Date()),
            is_typing: true
        }
        socket().emit('typing', data)
    }
}

const handleOnRender = (data: ChatMessage) => {
    if (data.is_read != true && data.from != user.user_id) {
        console.log("handle on render: ", data)
        socket().emit('mark-message-read', data)
    }
}

socket().on('get-messages', (response: ResponseChatMessage) => {
    console.log(response)
    page.value = response.next_page
    messages.value.unshift(...response.messages)
    loading.value = false
})

socket().on('message', (data: ChatMessage) => {
    removeTypingFromMessages()
    messages.value = messages.value.concat(data)
    console.log(messages.value)
})

socket().on('typing', (data: ChatMessage) => {
    if (!typingIsExist() && data.from === secondUser.value?.user_id) {
        messages.value = messages.value.concat(data)

        //clear after 3 sec
        setTimeout(() => {
            removeTypingFromMessages()
        }, 3000);
    }
})

socket().on('mark-message-read', (data: ChatMessage) => {
    console.log('mark-message-read', data)
    if (user.user_id == data.from) {
        for (let index = 0; index < messages.value.length; index++) {
            if (messages.value[index].message_id === data.message_id) {
                messages.value[index].is_read = true
                console.log("update as read is achieve yeay!")
            }
        }
    }
})

socket().on('user-connected', (data: ChatSession) => {
    // update user in online / connected
    updateStatusUser(data, "user-online: ")
})

socket().on('user-disconnected', (data: ChatSession) => {
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

function getSessionOtherUser(user?: User): ChatSession | undefined {
    return sessions.value.find(session => session.user_id === user?.user_id)
}

function getMessages(user_id?: string, pageNumber?: number, itemPerPageNumber?: number) {
    if (!loading.value) {
        loading.value = true
        const data = {
            user_id: user_id ?? secondUser.value?.user_id,
            page: pageNumber ?? page.value,
            item_per_page: itemPerPageNumber ?? itemPerPage
        }
        socket().emit('request-messages', data)
        console.log('request messages')
    }
}

function handleSocketDisconnect(): void {
    if (socket()) {
        socket().off('get-messages')
        socket().off('message')
        socket().off('typing')
        socket().off('mark-message-read')
        socket().off('user-joined')
        socket().off('user-disconnected')
        socket().offAny()
        socket().disconnect()
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
    if (!socket().connected) {
        console.log('try to connecting')
        authSocket()
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
                    connected: false
                }, {
                    user_id: secondUser.value.user_id,
                    user: secondUser.value,
                    connected: false
                })
                loading.value = false
                getMessages(secondUser.value.user_id)
            }
        })
})

</script>