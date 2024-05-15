<template>
    <UiContainer class="max-w-2xl p-6">
        <div v-for="conversation in conversations" class="flex flex-col">
            <div @click="handleClickConversation(conversation.conversation_id)"
                class="flex flex-row items-center gap-4">
                <UiAvatar class="h-10 w-10" :src="convoMethod(conversation).them().at(0)?.avatar"
                    :fallback="getInitials(convoMethod(conversation).them().at(0)?.name ?? 'NaN')" />
                <div class="flex flex-col w-full">
                    <div class="flex flex-row items-center">
                        <div class="text-base font-bold pr-3">{{ convoMethod(conversation).them().at(0)?.name }}</div>
                        <ChatStatusIcon :isOnline="convoMethod(conversation).them().at(0)?.is_online" />
                        <span v-if="convoMethod(conversation).them().at(0)?.is_online"
                            class="text-secondary-foreground/70 text-[10px] pl-1">online</span>
                        <span v-else class="text-secondary-foreground/70 text-[10px] pl-1">offline</span>
                        <p class="ml-auto text-xs font-normal text-muted-foreground">
                            {{ getLastMessageInfo(conversation).lastChatTime }}
                        </p>
                    </div>

                    <div class="flex flex-row items-center">
                        <div class="text-sm text-secondary-foreground/90">
                            {{ conversation.last_chat?.substring(0, 120) }}
                        </div>
                        <!-- <div v-if="getLastMessageInfo(session.messages).totalUnreadMessages > 0"
                            class="flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full h-4 w-4 ml-auto">
                            {{ getLastMessageInfo(session.messages).totalUnreadMessages }}
                        </div> -->
                    </div>
                </div>

            </div>
            <UiDivider class="pt-4 pb-4" />
        </div>
    </UiContainer>
</template>
<script lang="ts" setup>
import type { User } from "~/types/User";
import { TypeMessage, type RequestConversations, type ResponseConversations } from "~/types";
import type { Conversation } from "~/types/Conversation";

const socket = useSocket.getInstance()
const { getMultipleUsers } = useUserService()
const conversations = ref<Conversation[]>()
const obrolans = ["abc", "def"]
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const page = ref<number | null>(1)
const itemPerPage: number = 10

const getLastMessageInfo = (conversation: Conversation): { lastChatTime: string } => {
    const defaultResult = {
        lastChatTime: getTimeAgo((new Date()).toISOString()),
    }

    if (conversation.last_chat_timestamp) {
        defaultResult.lastChatTime = getTimeAgo(new Date(conversation.last_chat_timestamp).toISOString())
        return defaultResult
    }
    return defaultResult
}

// const getLastMessageInfo = (messages?: ChatMessage[]): { lastMessage: string, lastMessageTime: string, totalUnreadMessages: number } => {
//     const totalUnread = messages?.filter(message => message.is_read != true && message.to == user.user_id).length ?? 0
//     const defaultResult = {
//         lastMessage: "Chat aku dong!",
//         lastMessageTime: getTimeAgo((new Date()).toISOString()),
//         totalUnreadMessages: totalUnread
//     }
//     const lastItem = (messages?.length ?? 1) - 1
//     const message = messages?.at(lastItem)
//     if (message && message.content) {
//         const lastMessageTime = getTimeAgo((new Date(message.created_at)).toISOString())
//         switch (message.content.type) {
//             case TypeContentMessage.text:
//                 const msg = message.content as TextMessage
//                 defaultResult.lastMessage = msg.text
//                 defaultResult.lastMessageTime = lastMessageTime
//                 return defaultResult
//             case TypeContentMessage.image:
//                 defaultResult.lastMessage = '[image]'
//                 defaultResult.lastMessageTime = lastMessageTime
//                 return defaultResult
//             default:
//                 defaultResult.lastMessageTime = lastMessageTime
//                 return defaultResult
//         }
//     }
//     return defaultResult
// }

socket.on('res_conversations', (data: ResponseConversations) => {
    page.value = data.next_page
    conversations.value = conversations.value?.concat(...data.conversations) ?? data.conversations
})

// socket().on('get-users', async (users: ChatSession[]) => {
//     const usersData = users
//     let userIds: string[] = usersData.map(session => session.user_id)
//     await getMultipleUsers(userIds)
//         .then((result) => {
//             const users = result as User[]
//             for (let index = 0; index < users.length; index++) {
//                 const userFromAPI = users.find((user) => user.user_id === usersData[index].user_id)

//                 if (userFromAPI) {
//                     const session: ChatSession = {
//                         user_id: usersData[index].user_id,
//                         user: userFromAPI,
//                         connected: usersData[index].connected,
//                         messages: usersData[index].messages
//                     }
//                     sessions.value.push(session)
//                     console.log("session: ", sessions.value)
//                 }
//             }
//         })
//         .catch((error) => {
//             const { showMessage } = useMessage()
//             showMessage(error.message, TypeMessage.destructive)
//         })
// })

function handleClickConversation(conversation_id: string) {
    navigateTo(`/chats/${conversation_id}`)
}

function getConversations(user_id: string, page: number, itemPerPage: number) {
    const request: RequestConversations = {
        user_id: user_id,
        page: page,
        item_per_page: itemPerPage
    }

    socket.emit('req_conversations', request)
}

onMounted(() => {
    socket.establishConnection()
    if (page.value) {
        getConversations(user.user_id, page.value, itemPerPage)
    }
})
</script>