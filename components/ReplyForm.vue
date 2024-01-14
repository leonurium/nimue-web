<!-- ReplyForm.vue -->
<template>
    <form @submit.prevent="submitReply" class="flex items-center gap-2">
        <UiAvatar class="h-10 w-10 rounded-full" :fallback="getInitials('Netijen Curhat')" />
        <UiInput v-model="replyText" class="rounded-full max-w-2xl" placeholder="mau bales apa?"></UiInput>
        <UiButton type="submit" class="rounded-full">Post</UiButton>
    </form>
</template>

<script lang="ts" setup>

import type { BaseResponse } from '~/types/timeline';

const base_url = useRuntimeConfig().public.base_api_url;
const replyText = ref('');

const submitReply = () => {
    // Handle the reply submission logic here
    console.log('Submitted:', replyText.value);

    // Reset the form
    replyText.value = '';
    // Hide the form
};

const addNewReply = async () => {
    try {
        const responseReply = await $fetch<BaseResponse>(
            `${base_url}/comment/new`,
            { method: 'POST' }
        );
        console.log(responseReply)
        if (responseReply.success) {

        } else {
            console.log(responseReply.message)
        }
    } catch (error) {
        console.log(error)
    } finally {

    }
}
</script>

<style scoped>
/* Add your custom styling here */
/* You might want to customize the appearance of the avatar, textarea, and button */
</style>