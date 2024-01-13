<template>
    <UiContainer class="max-w-2xl p-6">
        <div class="flex w-full">
            <div class="flex items-center space-x-4">
                <UiAvatar class="h-12 w-12 rounded-full" :fallback="getInitials(timeline?.name ?? 'Netijen Curhat')" />
                <div class="space-y-2">
                    <h1 class="h-4 text-lg font-bold"> {{ timeline?.name }} </h1>
                    <h5 class="h-4 text-xs"> {{ getTimeAgo(timeline?.timed ?? "") }} </h5>
                </div>
            </div>
            <div class="ml-auto">
                <IconMoreHorizontal />
            </div>
        </div>
        <div class="w-full text-lg pt-4 pb-4">
            {{ timeline?.text_content }}
        </div>
        <div class="flex items-center gap-5">
            <p class="text-sm text-gray-500">{{ timeline?.total_likes + ((timeline?.total_likes ?? 0) > 1 ? " likes" : " like") }}</p>
            <p class="text-sm text-gray-500">{{ timeline?.total_comments + ((timeline?.total_comments ?? 0) > 1 ? " replies" : " reply") }}</p>
        </div>
        <UiDivider class="pt-4 pb-4"/>
    </UiContainer>
</template>

<script lang="ts" setup>
import { type BaseResponse, type Timeline } from '@/types/timeline';
const base_url = useRuntimeConfig().public.base_api_url;
const timeline = ref<Timeline>()
const { timeline_id } = useRoute().params

const getTimelineById = async () => {
    try {
        const responseTimeline = await $fetch<BaseResponse>(
            `${base_url}/timeline/${timeline_id}`,
            { method: 'GET' }
        );
        if (responseTimeline.success) {
            const data = responseTimeline.data as Timeline
            timeline.value = data
        } else {
            console.log(responseTimeline.message)
        }
    } catch (error) {
        console.log(error)
    } finally {

    }
}
getTimelineById();
</script>

<style></style>