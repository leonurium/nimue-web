<template>
    <div class="flex flex-col gap-10">
        <UiCard class="shadow-lg rounded-lg" v-for="timeline in props.timelines" :key="timeline.timeline_id">
            <div class="flex flex-col gap-5 p-6" v-if="!timeline.is_ads">
                <CardThreads
                    :timeline="timeline"
                    :likeIsClicked="likeStates[timeline.timeline_id]?.likeClicked ?? false"
                    :isOwnerThread="timeline.user_id == user.user_id"
                    @onClickLike="handleLike"
                    @onClickReply="handleReply"
                    @onClickShare="handleShare"
                    @onClickSendChat="handleSendChat"
                    @onClickReport="hanldeReport"
                    @onClickDelete="handleDelete"
                />
            </div>

            <div v-else>
                <UiCard title="Space Iklan" description="Hubungi 089123456789" />
            </div>
        </UiCard>
    </div>
</template>

<script lang="ts" setup>
import type { User } from '~/types/user';
import type { Timeline } from '@/types/timeline';

const props = defineProps({
    timelines: {
        type: Object as () => Timeline[],
        default: [],
        required: true
    }
})

const {
    doLikeTimeline,
    doUnlikeTimeline,
    doShareTimeline,
    deleteTimeline
} = useTimelineService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const likeStates = reactive<{ [key: number]: { likeClicked: boolean } }>({});

const getTimelineById = (timeline_id: number) => {
    const item = props.timelines.filter(item => item.timeline_id == timeline_id)
    return item.at(0)
}

function handleSendChat(timeline_id: number) {
    const timeline = getTimelineById(timeline_id)
    const userId = timeline?.user_id ?? 1
    navigateTo(`/chats/${userId}`)
}

function hanldeReport(timeline_id: number) {
    navigateTo(`/report/${timeline_id}`)
}

function handleDelete(timeline_id: number) {
    deleteTimeline(timeline_id)
        .then(() => {
            location.reload()
        })
        .catch((error) => {
            useToast().toast({
                title: "Failed",
                description: error,
                duration: 5000,
                icon: "lucide:thumbs-down",
            });
        })
}

function handleShare(timeline_id: number) {
    doShareTimeline(user.user_id, timeline_id)
        .catch((error) => {
            console.log(error)
        })
}

function handleReply(timeline_id: number) {
    navigateTo(`/${timeline_id}`)
}

function handleLike(timeline_id: number) {
    if ((likeStates[timeline_id]?.likeClicked ?? false) == false) {
        if (!likeStates[timeline_id]) {
            likeStates[timeline_id] = {
                likeClicked: false
            };
        }
        likeStates[timeline_id].likeClicked = true;

        if (getTimelineById(timeline_id)?.is_liked ?? false) {
            doUnlikeTimeline(user.user_id, timeline_id)
                .then((result) => {
                    getTimelineById(timeline_id)!.is_liked = false
                    if (getTimelineById(timeline_id)?.total_likes ?? 0 > 0) {
                        getTimelineById(timeline_id)!.total_likes -= 1
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
                    getTimelineById(timeline_id)!.is_liked = true
                    getTimelineById(timeline_id)!.total_likes += 1
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