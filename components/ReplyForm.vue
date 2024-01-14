<!-- ReplyForm.vue -->
<template>
    <form @submit.prevent="submitReply" class="flex items-center gap-2">
        <UiAvatar class="h-10 w-10 rounded-full" :fallback="getInitials(timeline?.name ?? 'Netijen Curhat')" />
        <UiInput v-model="replyText" class="rounded-full max-w-2xl" placeholder="mau bales apa?"></UiInput>
        <UiButton type="submit" class="rounded-full">Post</UiButton>
    </form>
</template>

<script setup>

import { BaseResponse } from '~/types/timeline';

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
        const responseReply = $fetch<BaseResponse>(
            `${base_url}/comment/${timeline_id}/${page.value}/${itemPerPage.value}`,
            { method: 'GET' }
        );
        console.log(responseComment)
        if (responseComment.success) {

        } else {
            console.log(responseComment.message)
        }
    } catch (error) {
        console.log(error)
    } finally {
        loadingMore.value = false
    }
}
</script>

<style scoped>
/* Add your custom styling here */
/* You might want to customize the appearance of the avatar, textarea, and button */
</style>