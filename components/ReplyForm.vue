<!-- ReplyForm.vue -->
<template>
    <div class="flex flex-row pl-12 pb-1 gap-1">
        <UiButton class="rounded-full h-8 w-8" v-for="(emoji, index) in emojis" @click="emojiClicked(index)"
            variant="ghost">{{ emoji }}
        </UiButton>
    </div>
    <form @submit.prevent="submitReply" class="flex items-center gap-2">
        <UiAvatar class="h-10 w-10 rounded-full" :fallback="getInitials(user.name)" />
        <UiInput v-model="replyText" class="rounded-full max-w-2xl" placeholder="mau bales apa?" required></UiInput>
        <UiButton type="submit" class="rounded-full">Post</UiButton>
    </form>
</template>

<script lang="ts" setup>
import type { User } from '~/types/user';
import usePreferencesService from '~/composables/usePreferencesService';

const { addNewReply } = useCommentService()
const { getReplyEmojis } = usePreferencesService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const emojis: string[] = getReplyEmojis()
const replyText = ref('')

const emits = defineEmits(['onSubmit'])

const props = defineProps({
    timeline_id: {
        type: Number,
        required: true
    }
})

function emojiClicked(index: number) {
    replyText.value += emojis[index]
}

const submitReply = () => {
    // Handle the reply submission logic here
    console.log('Submitted:', replyText.value);
    addNewReply(user, props.timeline_id, replyText.value)
        .then((result) => {
            emits("onSubmit", result)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            replyText.value = ""
        })
};
</script>

<style scoped>
/* Add your custom styling here */
/* You might want to customize the appearance of the avatar, textarea, and button */
</style>