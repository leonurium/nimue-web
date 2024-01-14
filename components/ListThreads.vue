<template>
    <div class="flex flex-col gap-10">
        <UiCard class="shadow-lg rounded-lg" v-for="timeline in timelines" :key="timeline.timeline_id">
            <div class="flex flex-col gap-5 p-6" v-if="!timeline.is_ads">
                <div class="flex w-full">
                    <div class="flex items-center space-x-4">
                        <UiAvatar class="h-12 w-12 rounded-full" :fallback="getInitials(timeline.name)" />
                        <div class="space-y-2">
                            <h1 class="h-4 text-base font-bold"> {{ timeline.name }} </h1>
                            <h5 class="h-4 text-xs"> {{ getTimeAgo(timeline.timed) }} </h5>
                        </div>
                    </div>
                    <div class="ml-auto">
                        <IconMoreHorizontal />
                    </div>
                </div>
                <div class="w-full text-base">
                    {{ timeline.text_content }}
                </div>
                <div class="flex items-center gap-2">
                    <!-- <IconHeart class="text-red-500"/> -->
                    <UiButton @click="doLikeTimeline(timeline.timeline_id)"
                        class="rounded-full bg-clear text-gray-800 dark:text-gray-50 hover:bg-gray-200">
                        <IconHeart
                            v-if="timeline.is_liked"
                            class="text-red-500" />
                        <IconHeart v-else />
                        {{ timeline.total_likes }}
                    </UiButton>
                    <UiButton @click="goToComment(timeline.timeline_id)"
                        class="rounded-full bg-clear text-gray-800 dark:text-gray-50 hover:bg-gray-200">
                        <IconMessageCircle />{{ timeline.total_comments }}
                    </UiButton>
                    <div class="ml-auto">
                        <IconShare />
                    </div>
                </div>
            </div>

            <div v-else>
                <UiCard title="Space Iklan" description="Hubungi 089123456789" />
            </div>
        </UiCard>
    </div>
</template>

<script lang="ts" setup>
import type { BaseResponse, Timeline } from '@/types/timeline';

const base_url = useRuntimeConfig().public.base_api_url;
const device_id = ref('B6961C40-5D18-48FE-B06C-1314B34162CC')

const props = defineProps<{
    timelines: Timeline[]
}>();

function goToComment(timeline_id: number) {
    navigateTo(`/${timeline_id}`)
}

const doLikeTimeline = async (timeline_id: number) => {
    const item = props.timelines.filter(item => item.timeline_id == timeline_id)
    console.log(props.timelines)
    if (item[0].is_liked ?? false) {
        console.log('udah di like')
    } else {
        try {
            const responseLike = await $fetch<BaseResponse>(
                `${base_url}/timeline/like/`,
                {
                    method: 'POST',
                    body: {
                        'device_id': `${device_id.value}`,
                        'timeline_id': `${timeline_id}`
                    }
                }
            );
            console.log(responseLike)
            if (responseLike.success) {
                console.log(responseLike.message)
            } else {
                console.log(responseLike.message)
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }
}

</script>

<style></style>