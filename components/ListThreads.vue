<template>
    <div class="flex flex-col gap-10">
        <UiCard class="shadow-lg rounded-lg" v-for="timeline in timelines" :key="timeline.timeline_id">
            <div class="flex flex-col gap-5 p-6" v-if="!timeline.is_ads">
                <CardThreads
                :timeline="timeline"
                :likeIsClicked="likeStates[timeline.timeline_id]?.likeClicked ?? false"
                @onClickLike="buttonLikeClicked"
                @onClickComment="goToComment"
                />
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
const likeStates = reactive<{ [key: number]: { likeClicked: boolean } }>({});

const props = defineProps<{
    timelines: Timeline[]
}>();

const timeline = (timeline_id: number) => {
    const item = props.timelines.filter(item => item.timeline_id == timeline_id)
    return item.at(0)
}

function goToComment(timeline_id: number) {
    navigateTo(`/${timeline_id}`)
}

function buttonLikeClicked(timeline_id: number) {
    if ((likeStates[timeline_id]?.likeClicked ?? false) == false) {
        if (!likeStates[timeline_id]) {
            likeStates[timeline_id] = {
                likeClicked: false
            };
        }
        likeStates[timeline_id].likeClicked = true;

        if (timeline(timeline_id)?.is_liked ?? false) {
            doUnlikeTimeline(timeline_id)
        } else {
            doLikeTimeline(timeline_id)
        }
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
            timeline(timeline_id)!.is_liked = true
            timeline(timeline_id)!.total_likes += 1
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
            timeline(timeline_id)!.is_liked = false
            if (timeline(timeline_id)?.total_likes ?? 0 > 0) {
                timeline(timeline_id)!.total_likes -= 1
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