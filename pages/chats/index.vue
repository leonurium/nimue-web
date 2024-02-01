<template>
    <UiContainer class="max-w-2xl p-6">
        <div v-for="session in sessions" class="flex flex-col">
            <div @click="handleClickUser(session.user?.user_id)" class="flex flex-row items-center gap-4">
                <UiAvatar class="h-10 w-10" :src="session.user?.avatar"
                    :fallback="getInitials(session.user?.name ?? 'NaN')" />
                <div class="flex flex-col w-full">
                    <div class="flex flex-row items-center">
                        <div class="text-base font-bold pr-3">{{ session.user?.name }}</div>
                        <ChatStatusIcon :isOnline="session.connected" />
                        <span v-if="session?.connected" class="text-secondary-foreground/70 text-[10px] pl-1">online</span>
                        <span v-else class="text-secondary-foreground/70 text-[10px] pl-1">offline</span>
                        <p class="ml-auto text-xs font-normal text-muted-foreground">
                            {{ getLastMessageInfo(session.messages).lastMessageTime }}
                        </p>
                    </div>

                    <div class="flex flex-row items-center">
                        <div class="text-sm text-secondary-foreground/90">
                            {{ getLastMessageInfo(session.messages).lastMessage.substring(0, 120) }}
                        </div>
                        <div v-if="getLastMessageInfo(session.messages).totalUnreadMessages > 0"
                            class="flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full h-4 w-4 ml-auto">
                            {{ getLastMessageInfo(session.messages).totalUnreadMessages }}
                        </div>
                    </div>
                </div>

            </div>
            <UiDivider class="pt-4 pb-4" />
        </div>
    </UiContainer>
</template>
<script lang="ts" setup>
import type { User } from "~/types/user";
import {
    TextMessage,
    type ChatMessage,
    type ChatSession,
    TypeContentMessage
} from "~/types/chat_message"
import { TypeMessage } from "~/types";

definePageMeta({
    middleware: 'socket'
})

const socket = useSocket()
const { getMultipleUsers } = useUserService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const sessions = ref<ChatSession[]>([])

const getLastMessageInfo = (messages?: ChatMessage[]): { lastMessage: string, lastMessageTime: string, totalUnreadMessages: number } => {
    const totalUnread = messages?.filter(message => message.is_read != true && message.to == user.user_id).length ?? 0
    const defaultResult = {
        lastMessage: "Chat aku dong!",
        lastMessageTime: getTimeAgo((new Date()).toISOString()),
        totalUnreadMessages: totalUnread
    }
    const lastItem = (messages?.length ?? 1) - 1
    const message = messages?.at(lastItem)
    if (message && message.content) {
        switch (message.content.type) {
            case TypeContentMessage.text:
                const msg = message.content as TextMessage
                return {
                    lastMessage: msg.text,
                    lastMessageTime: getTimeAgo((new Date(message.timestamp)).toISOString()),
                    totalUnreadMessages: defaultResult.totalUnreadMessages
                }
            default:
                return {
                    lastMessage: defaultResult.lastMessage,
                    lastMessageTime: getTimeAgo((new Date(message.timestamp)).toISOString()),
                    totalUnreadMessages: defaultResult.totalUnreadMessages
                }
        }
    }
    return defaultResult
}

socket.value?.on('get-users', async (users: ChatSession[]) => {
    const usersData = users
    let userIds: string[] = usersData.map(session => session.user_id)
    await getMultipleUsers(userIds)
        .then((result) => {
            const users = result as User[]
            for (let index = 0; index < users.length; index++) {
                const userFromAPI = users.find((user) => user.user_id === usersData[index].user_id)

                if (userFromAPI) {
                    const session: ChatSession = {
                        user_id: usersData[index].user_id,
                        user: userFromAPI,
                        connected: usersData[index].connected,
                        messages: usersData[index].messages
                    }
                    sessions.value.push(session)
                    console.log("session: ", sessions.value)
                }
            }
        })
        .catch((error) => {
            const { showMessage } = useMessage()
            showMessage(error.message, TypeMessage.destructive)
        })
})

function handleClickUser(user_id?: string) {
    navigateTo(`/chats/${user_id}`)
}

function handleSocketDisconnect(): void {
    if (socket.value) {
        socket.value.off('get-users')
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
</script>