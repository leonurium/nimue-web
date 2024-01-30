<template>
    <div
        class="p-3 rounded-lg"
        :class="{
            'col-start-1 col-end-8': !props.is_sender,
            'col-start-6 col-end-13': props.is_sender
        }"
    >
        <div
            :class="{
                'justify-start flex-row-reverse': props.is_sender
            }"
            class="flex flex-row items-center gap-3">
            <UiAvatar
                class="h-10 w-10"
                :class="{
                    'scale-x-[-1]': props.is_sender
                }"
                :src="props.avatar ?? ''"
                :fallback="getInitials(props.username ?? 'NaN')"
            />
            <div
                :class="{
                    'bg-white': !props.is_sender,
                    'bg-blue-200': props.is_sender
                }"
                class="relative text-sm text-slate-600 py-2 px-4 shadow rounded-xl">
                <div v-if="props.is_typing" class="italic">Typing...</div>
                <div v-if="textMessage?.text">{{ textMessage?.text }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    type ContentMessage,
    TypeContentMessage,
    TextMessage
} from '~/types/chat_message';

const props = defineProps({
    username: {
        type: String,
        required: false
    },
    content_message: {
        type: Object as () => ContentMessage | undefined,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    timestamp: {
        type: String,
        required: true
    },
    is_sender: {
        type: Boolean,
        required: false
    },
    is_typing: {
        type: Boolean,
        required: false
    }
})

const textMessage = ref<TextMessage>()

onBeforeMount(() => {
    switch (props.content_message?.type) {
        case TypeContentMessage.text:
            textMessage.value = props.content_message as TextMessage
            break;
    }
})

</script>