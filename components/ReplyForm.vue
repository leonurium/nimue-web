<!-- ReplyForm.vue -->
<template>
    <div class="flex flex-col gap-1 bg-background/90 backdrop-blur p-3">
        <div class="flex flex-row pl-12 gap-1">
            <UiButton class="rounded-full h-8 w-8" v-for="(emoji, index) in emojis" @click="emojiClicked(index)"
                variant="ghost">{{ emoji }}
            </UiButton>
        </div>
        <form @submit.prevent="submitReply" class="flex items-center gap-2">
            <UiAvatar
                class="h-10 w-10 rounded-full"
                :src="props.user.avatar"
                :fallback="getInitials(props.user.name)"
            />
            <CldUploadWidget
                v-if="props.withImageUpload"
                v-slot="{ open }"
                :onUpload="handleUpload"
                uploadPreset="nimue_upload_preset">
                <UiButton
                    class="rounded-full h-10 w-10 shrink-0"
                    @click="open"
                    size="icon-sm"
                >
                    <IconImage class="h-4 w-4"/>
                </UiButton>
            </CldUploadWidget>

            <UiInput
                @update:model-value="handleInputUpdateModelValue"
                v-model="replyText"
                class="rounded-full"
                placeholder="mau bales apa?"
                required
            />
            <UiButton type="submit" class="rounded-full">Send</UiButton>
        </form>
    </div>
</template>

<script lang="ts" setup>
import type { User } from '~/types/user';
import usePreferencesService from '~/composables/usePreferencesService';
import type { CloudinaryUploadResponse } from '~/types/cloudinary';

const { getReplyEmojis } = usePreferencesService()
const emojis: string[] = getReplyEmojis()
const replyText = ref('')
const preset = useRuntimeConfig().public.cloudinary.uploadPreset

const emits = defineEmits(['onSubmit', 'onKeypress', 'onUpload'])

const props = defineProps({
    user: {
        type: Object as () => User,
        required: true
    },
    withImageUpload: {
        type: Boolean,
        required: false,
        default: false
    }
})

function emojiClicked(index: number) {
    replyText.value += emojis[index]
}

const handleInputUpdateModelValue = (value: string) => {
    emits('onKeypress', value)
}

const handleUpload = (value: CloudinaryUploadResponse) => {
    //passing url if success
    if(value._value.event == 'success') {
        emits('onUpload', value._value.info.secure_url)
    }
}

const submitReply = () => {
    emits('onSubmit', replyText.value)
    replyText.value = ""
};
</script>

<style scoped>
/* Add your custom styling here */
/* You might want to customize the appearance of the avatar, textarea, and button */
</style>