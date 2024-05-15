<template>
    <NuxtLayout :user="convoMethod(conversation).them().at(0)" name="chat">
        <div class="flex flex-col overflow-scroll h-[calc(100svh-56px-56px-76px-12px)]">
            <!-- loading -->
            <LoadingSpinner v-if="loading" class="w-full h-16" />
            <Observer @intersect="getChats(conversation?.conversation_id ?? String(chat_id), page, itemPerPage)" />
            <div v-for="chat in conversation?.chats" class="grid grid-cols-12 gap-y-2">
                <!-- typing -->
                <ChatBubble v-if="chat.is_typing ?? false" :username="chat.from.name" :avatar="chat.from.avatar"
                    :timestamp="new Date(chat.created_at)" :is_sender="chat.from.user_id == user.user_id"
                    :is_typing="chat.is_typing" />
                <!-- chat bubble from -->
                <ChatBubble v-else :key="chat.chat_id" :username="chat.from.name" :content_message="chat.content"
                    :avatar="chat.from.avatar" :timestamp="new Date(chat.created_at)"
                    :is_sender="chat.from.user_id == user.user_id" :is_read="chat.is_read ?? false"
                    @onRender="handleOnRender(chat)" />
            </div>
        </div>
        <ReplyForm class="sticky bottom-14 border-t" :user="user" @onSubmit="handleSendMessage"
            @onKeypress="handleKeypress" @onUpload="handleUpload" withImageUpload />
    </NuxtLayout>
</template>
<script lang="ts" setup>
import type { RequestChats, ResponseChats } from "~/types";
import type { User } from "~/types/User";
import type { Chat } from "~/types/Chat";
import type { Conversation } from "~/types/Conversation";
import { convoMethod } from "~/utils";
import type { ImageContentChat, TextContentChat } from "~/types/ContentChat";

definePageMeta({
    layout: false
})

const { chat_id } = useRoute().params
const socket = useSocket.getInstance()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const conversation = ref<Conversation>()
const page = ref<number | null>(1)
const itemPerPage: number = 10
const loading = ref<boolean>(true)

const handleSendMessage = (message: string) => {
    if (!conversation.value) { return }
    const convo = convoMethod(conversation.value)
    if (!convo) { return }
    const otherUser = convo.them().at(0)
    const content: TextContentChat = {
        type: 'text',
        text: message
    }

    if (otherUser) {
        const data: Chat = {
            chat_id: crypto.randomUUID(),
            conversation_id: conversation.value.conversation_id,
            from: convo.me() ?? user,
            to: otherUser,
            content: content,
            is_read: false,
            is_typing: false,
            created_at: new Date().getTime()
        }

        socket.emit('req_send_chat', data)
    }
}

const handleUpload = (value: string) => {
    if (!conversation.value) { return }
    const convo = convoMethod(conversation.value)
    if (!convo) { return }
    const otherUser = convo.them().at(0)
    const content: ImageContentChat = {
        type: 'image',
        url_image: value,
        meta: {
            width: 100,
            height: 100
        }
    }

    if (otherUser) {
        const data: Chat = {
            chat_id: crypto.randomUUID(),
            conversation_id: conversation.value.conversation_id,
            from: convo.me() ?? user,
            to: otherUser,
            content: content,
            is_read: false,
            is_typing: false,
            created_at: new Date().getTime()
        }

        socket.emit('req_send_chat', data)
    }
}

const handleKeypress = () => {
    if (!conversation.value) { return }
    const convo = convoMethod(conversation.value)
    if (!convo) { return }
    const content: TextContentChat = {
        type: "text",
        text: "typing.."
    }

    const data: Chat = {
        chat_id: crypto.randomUUID(),
        conversation_id: conversation.value.conversation_id,
        from: convo.me() ?? user,
        to: convo.them().at(0) ?? user,
        content: content,
        is_typing: true,
        created_at: new Date().getTime()
    }
    socket.emit('req_typing', data)
}

const handleOnRender = (data: Chat) => {
    if (data.is_read != true && data.from.user_id != user.user_id) {
        console.log("handle on render: ", data)
        // socket.emit('mark-message-read', data)
    }
}

socket.on('res_conversation_by_id', (data: Conversation) => {
    const newChats = data.chats.reverse()
    data.chats = newChats
    conversation.value = data
})

socket.on('res_chats', (data: ResponseChats) => {
    page.value = data.next_page
    const newChats = data.chats.reverse()
    conversation.value?.chats.unshift(...newChats)
    loading.value = false
})

socket.on('res_send_chat', (data: Chat) => {
    if (!conversation.value) { return }
    removeTypingFromMessages()
    conversation.value.chats = conversation.value.chats.concat(data)
    console.log(conversation.value.chats)
})

socket.on('res_typing', (data: Chat) => {
    if (!conversation.value) { return }
    const otherUser = convoMethod(conversation.value).them().at(0)
    if (!otherUser) { return }

    if (!typingIsExist() && data.from.user_id === otherUser.user_id) {
        conversation.value.chats = conversation.value.chats.concat(data)

        //clear after 3 sec
        setTimeout(() => {
            removeTypingFromMessages()
        }, 3000);
    }
})

// socket().on('mark-message-read', (data: ChatMessage) => {
//     console.log('mark-message-read', data)
//     if (user.user_id == data.from) {
//         for (let index = 0; index < messages.value.length; index++) {
//             if (messages.value[index].message_id === data.message_id) {
//                 messages.value[index].is_read = true
//                 console.log("update as read is achieve yeay!")
//             }
//         }
//     }
// })

// socket().on('user-connected', (data: ChatSession) => {
//     // update user in online / connected
//     updateStatusUser(data, "user-online: ")
// })

// socket().on('user-disconnected', (data: ChatSession) => {
//     // update user is offline / disconnected
//     updateStatusUser(data, "user-offline: ")
// })

function typingIsExist(): boolean {
    const messages = conversation.value?.chats.filter((chat) => {
        const is_typing = chat.is_typing ?? false
        if (is_typing) {
            return chat
        }
    })
    return (messages?.length ?? 0) > 0
}

function removeTypingFromMessages() {
    if (conversation.value) {
        const newChats = conversation.value.chats.filter((chat) => {
            const is_typing = chat.is_typing ?? false
            if (!is_typing) {
                return chat
            }
        })
        conversation.value.chats = newChats
    }
}

// function updateStatusUser(data: ChatSession, status: string) {
//     for (let index = 0; index < sessions.value.length; index++) {
//         if (sessions.value[index].user_id == data.user_id) {
//             sessions.value[index].connected = data.connected
//             console.log(`${status}`, data.user_id)
//         }
//     }
// }

function getChats(conversation_id: string, page: number | null, itemPerPage: number) {
    if (!loading.value && page != null) {
        loading.value = true
        const request: RequestChats = {
            conversation_id: conversation_id,
            page: page,
            item_per_page: itemPerPage
        }
        socket.emit('req_chats', request)
    }
}

function getConversation(conversation_id: string) {
    socket.emit('req_conversation_by_id', conversation_id)
}

onMounted(() => {
    if (!socket.connected) {
        console.log('try to connecting')
        socket.establishConnection()
    }

    const convo_id = String(chat_id)
    loading.value = false
    getConversation(convo_id)
})

</script>