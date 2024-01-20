<template>
    <div class="flex flex-col gap-10">
        <UiCard class="shadow-lg rounded-lg" v-for="timeline in timelines" :key="timeline.timeline_id">
            <div class="flex flex-col gap-5 p-6" v-if="!timeline.is_ads">
                <CardThreads :timeline="timeline" :likeIsClicked="likeStates[timeline.timeline_id]?.likeClicked ?? false"
                    @onClickLike="buttonLikeClicked" @onClickComment="goToComment" />
            </div>

            <div v-else>
                <UiCard title="Space Iklan" description="Hubungi 089123456789" />
            </div>
        </UiCard>
    </div>
</template>

<script lang="ts" setup>
import type {Timeline, User } from '@/types/timeline';
const { doLikeTimeline, doUnlikeTimeline } = useTimelineService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const likeStates = reactive<{ [key: number]: { likeClicked: boolean } }>({});

const props = defineProps({
    timelines: {
        type: Object as () => Timeline[],
        default: [],
        required: true
    }
})

const timeline = (timeline_id: number) => {
    const item = props.timelines.filter(item => item.timeline_id == timeline_id)
    return item.at(0)
}

function goToComment(timeline_id: number) {
    navigateTo(`/${timeline_id}`)
}

function buttonShareClicked() {
    
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
            doUnlikeTimeline(user.user_id, timeline_id)
                .then((result) => {
                    timeline(timeline_id)!.is_liked = false
                    if (timeline(timeline_id)?.total_likes ?? 0 > 0) {
                        timeline(timeline_id)!.total_likes -= 1
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    likeStates[timeline_id].likeClicked = false;
                })
        } else {
            doLikeTimeline(user.user_id, timeline_id)
                .then((result) => {
                    timeline(timeline_id)!.is_liked = true
                    timeline(timeline_id)!.total_likes += 1
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    likeStates[timeline_id].likeClicked = false;
                })
        }
    }
}

</script>

<style></style>