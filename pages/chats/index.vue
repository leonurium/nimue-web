<template>
    <div class="flex items-center justify-center">
        <UiList class="max-w-sm">
            <template v-for="session in sessions">
                <UiListItem @click="handleClickUser(session.user?.user_id)" class="items-start px-0">
                    <UiAvatar :src="session.user?.avatar" :fallback="getInitials(session.user?.name ?? 'NaN')" />
                    <UiListContent>
                        <UiListTitle :title="session.user?.name" />
                        <UiListSubtitle class="line-clamp-2" :subtitle="getLastMessageInfo(session.messages).lastMessage" />
                    </UiListContent>
                    <p class="ml-auto text-xs font-normal text-muted-foreground">
                        {{ getLastMessageInfo(session.messages).lastMessageTime }}
                    </p>
                    <UiButton size="icon-sm" variant="ghost" class="ml-auto shrink-0 self-center rounded-full">
                        <Icon name="lucide:chevron-right" />
                    </UiButton>
                </UiListItem>
                <UiSeparator class="my-2.5 ml-auto w-[85%] last:hidden" />
            </template>
        </UiList>
    </div>
</template>
<script lang="ts" setup>
import type { User } from "~/types/user";
import {
    TextMessage,
    type ChatMessage,
    type ChatSession,
    TypeContentMessage
} from "~/types/chat_message"

definePageMeta({
    middleware: 'socket'
})

const socket = useSocket()
const { getMultipleUsers } = useUserService()
const sessions = ref<ChatSession[]>([])

const getLastMessageInfo = (messages?: ChatMessage[]): { lastMessage: string, lastMessageTime: string } => {
    const defaultResult = {
        lastMessage: "Chat aku dong!",
        lastMessageTime: getTimeAgo((new Date()).toISOString())
    }
    const lastItem = (messages?.length ?? 1) - 1
    const message = messages?.at(lastItem)
    if (message && message.content) {
        switch (message.content.type) {
            case TypeContentMessage.text:
                const msg = message.content as TextMessage
                return {
                    lastMessage: msg.text,
                    lastMessageTime: getTimeAgo((new Date(message.timestamp)).toISOString())
                }
            default:
                return {
                    lastMessage: defaultResult.lastMessage,
                    lastMessageTime: getTimeAgo((new Date(message.timestamp)).toISOString())
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
                if (usersData[index].user_id == users[index].user_id) {
                    const session: ChatSession = {
                        user_id: usersData[index].user_id,
                        user: users[index],
                        connected: usersData[index].connected,
                        messages: usersData[index].messages
                    }
                    sessions.value.push(session)
                    console.log("session: ", sessions.value)
                }
            }
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