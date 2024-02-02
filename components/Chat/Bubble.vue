<template>
    <div ref="containerMessage" class="pt-3 pb-3 rounded-lg" :class="{
        'col-start-1 col-end-8': !props.is_sender,
        'col-start-6 col-end-13': props.is_sender,
        'bubble-enter-active': appear,
        'bubble-enter': appear
    }">
        <div :class="{
            'justify-start flex-row-reverse': props.is_sender
        }" class="flex flex-row items-center gap-3">
            <UiAvatar class="h-10 w-10" :class="{
                'scale-x-[-1]': props.is_sender
            }" :src="props.avatar ?? ''" :fallback="getInitials(props.username ?? 'NaN')" />
            <div :class="{
                'bg-secondary text-secondary-foreground': !props.is_sender,
                'bg-primary text-primary-foreground': props.is_sender
            }" class="relative text-sm py-2 px-4 shadow rounded-xl">
                <div v-if="props.is_typing" class="italic">Typing...</div>
                <div v-if="textMessage?.text" class="flex flex-col">
                    <div>{{ textMessage?.text }}</div>

                    <div class="flex flex-row items-center gap-1 text-[9px] ml-auto">{{
                        props.timestamp.toLocaleTimeString() }}
                        <IconCheckCheck class="h-3 w-3" :class="{
                            'text-green-300': props.is_read,
                            'hidden': !props.is_sender
                        }" />
                    </div>
                </div>
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
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        required: true
    },
    is_sender: {
        type: Boolean,
        required: false
    },
    is_typing: {
        type: Boolean,
        required: false
    },
    is_read: {
        type: Boolean,
        required: false
    }
})

const emits = defineEmits(['onRender'])
const containerMessage = ref<HTMLElement | undefined>(undefined)
const textMessage = ref<TextMessage>()
const appear = ref(false)

onBeforeMount(() => {
    switch (props.content_message?.type) {
        case TypeContentMessage.text:
            textMessage.value = props.content_message as TextMessage
            break;
    }
})

onMounted(() => {
    console.log("on render is called")
    emits('onRender')
    nextTick(() => {
        containerMessage.value?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'end'
        })
        appear.value = true
    })
})

</script>

<style scoped>
.bubble-enter-active {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.bubble-enter {
    transform: scale(0.9);
    opacity: 100;
}
</style>