<!-- ReplyForm.vue -->
<template>
    <div class="flex flex-row pl-12 pb-1 gap-1">
        <UiButton class="rounded-full h-8 w-8" v-for="(emoji, index) in emojis" @click="emojiClicked(index)"
            variant="ghost">{{ emoji }}
        </UiButton>
    </div>
    <form @submit.prevent="submitReply" class="flex items-center gap-2">
        <UiAvatar class="h-10 w-10 rounded-full" :fallback="getInitials('Netijen Curhat')" />
        <UiInput v-model="replyText" class="rounded-full max-w-2xl" placeholder="mau bales apa?" required></UiInput>
        <UiButton type="submit" class="rounded-full">Post</UiButton>
    </form>
</template>

<script lang="ts" setup>

import type { BaseResponse, Preferences } from '@/types/timeline';
import usePreferencesService from '~/composables/usePreferencesService';

const base_url = useRuntimeConfig().public.base_api_url;
const device_id = ref('B6961C40-5D18-48FE-B06C-1314B34162CC');
const user_name = "Netijen Curhat Test";
const replyText = ref('');

const { getReplyEmojis, getPreferences } = usePreferencesService();
const emojis: string[] = getReplyEmojis()

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
    addNewReply(device_id.value, props.timeline_id, user_name, replyText.value)
};

const addNewReply = async (device_id: string, timeline_id: number, name: string, text_content: string) => {
    const params_body = {
        'device_id': device_id,
        'timeline_id': Number(timeline_id ?? 0),
        'name': name,
        'text_content': text_content,
        'comment_id': 0,
        'timed': useNow().value.toString()
    }

    try {
        const responseReply = await $fetch<BaseResponse>(
            `${base_url}/comment/new/`,
            {
                method: 'POST',
                body: params_body
            }
        );
        if (responseReply.success) {
            emits('onSubmit', params_body)
        } else {
            console.log(responseReply.message)
        }
    } catch (error) {
        console.log(error)
    } finally {
        replyText.value = '';
    }
}

onBeforeMount(async () => {
    await getPreferences()
})
</script>

<style scoped>
/* Add your custom styling here */
/* You might want to customize the appearance of the avatar, textarea, and button */
</style>