<template>
    <div class="flex flex-col gap-10">
        <UiCard class="shadow-lg rounded-lg" v-for="timeline in timelines" :key="timeline.timeline_id">
            <div class="flex flex-col gap-5 p-6" v-if="!timeline.is_ads">
                <div class="flex w-full">
                    <div class="flex items-center space-x-4">
                        <UiAvatar class="h-10 w-10 rounded-full" :fallback="getInitials(timeline.name)" />
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
                    <UiButton @click="buttonLikeClicked(timeline.timeline_id)"
                        variant="ghost"
                        class="rounded-full">
                        <IconHeart :class="{
                            'text-red-500': likeStates[timeline.timeline_id]?.isLiked ?? timeline.is_liked,
                            'animate-pulse': likeStates[timeline.timeline_id]?.likeClicked ?? false
                        }" />
                        <span :class="{
                            'animate-pulse': likeStates[timeline.timeline_id]?.likeClicked ?? false
                        }"
                        >{{ timeline.total_likes }}</span>
                    </UiButton>
                    <UiButton @click="goToComment(timeline.timeline_id)"
                        variant="ghost"
                        class="rounded-full">
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
const likeStates = reactive<{ [key: number]: { isLiked: boolean, likeClicked: boolean } }>({});

const props = defineProps<{
    timelines: Timeline[]
}>();

function goToComment(timeline_id: number) {
    navigateTo(`/${timeline_id}`)
}

function buttonLikeClicked(timeline_id: number) {
    if (!likeStates[timeline_id]) {
        likeStates[timeline_id] = {
            isLiked: false,
            likeClicked: false
        };
    }

    const item = props.timelines.filter(item => item.timeline_id == timeline_id)
    likeStates[timeline_id].isLiked = item.at(0)?.is_liked ?? false
    likeStates[timeline_id].likeClicked = true;
    
    console.log(props.timelines)

    if (likeStates[timeline_id].isLiked) {
        console.log('perform unlike')
        doUnlikeTimeline(timeline_id)
    } else {
        console.log('perform like')
        doLikeTimeline(timeline_id)
    }
}

const doLikeTimeline = async (timeline_id: number) => {
    try {
        const responseLike = await $fetch<BaseResponse>(
            `${base_url}/timeline/like/`,
            {
                method: 'POST',
                body: {
                    'device_id': `${device_id.value}`,
                    'timeline_id': timeline_id
                }
            }
        );
        console.log(responseLike)
        if (responseLike.success) {
            likeStates[timeline_id].isLiked = true;
            const item = props.timelines.filter(item => item.timeline_id == timeline_id)
            item.at(0)!.is_liked = true
            item.at(0)!.total_likes += 1
        } else {
            console.log(responseLike.message)
        }
    } catch (error) {
        console.log(error)
    } finally {
        likeStates[timeline_id].likeClicked = false;
    }
}

const doUnlikeTimeline = async (timeline_id: number) => {
    try {
        const responseUnlike = await $fetch<BaseResponse>(
            `${base_url}/timeline/unlike/`,
            {
                method: 'POST',
                body: {
                    'device_id': `${device_id.value}`,
                    'timeline_id': timeline_id
                }
            }
        );
        console.log(responseUnlike)
        if (responseUnlike.success) {
            likeStates[timeline_id].isLiked = false;
            const item = props.timelines.filter(item => item.timeline_id == timeline_id)
            item.at(0)!.is_liked = false
            if(item.at(0)?.total_likes ?? 0 > 0) {
                item.at(0)!.total_likes -= 1
            }
        } else {
            console.log(responseUnlike.message)
        }
    } catch (error) {
        console.log(error)
    } finally {
        likeStates[timeline_id].likeClicked = false;
    }
}

</script>

<style></style>