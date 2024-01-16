<template>
    <UiContainer class="max-w-2xl p-6">
        <div v-if="loading">
            <CardThreadsSkeleton />
        </div>
        <div v-else>
            <CardThreads :timeline="timeline" compact />

            <UiDivider class="pt-4 pb-4" />

            <ReplyForm :timeline_id="timeline?.timeline_id ?? 0" @onSubmit="refreshComment"/>

            <UiDivider class="pt-4 pb-4" />

            <div v-if="comments.length > 0">
                <UiContainer v-for="comment in comments" as="section" class="p-0 overflow-y-auto">
                    <CommentView :commentData="comment"/>
                </UiContainer>
            </div>

            <div v-else>
                no comment
            </div>
            <Observer @intersect="loadMore"/>
        </div>

    </UiContainer>
</template>

<script lang="ts" setup>
import type { BaseResponse, Timeline, CommentsData, Comment } from '@/types/timeline';
const base_url = useRuntimeConfig().public.base_api_url;
const { timeline_id } = useRoute().params
const itemPerPage = ref(10);
const page = ref(1);
const timeline = ref<Timeline>()
const comments = ref<Comment[]>([])
const loading = ref(false)
const loadingMore = ref(false)

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
        loading.value = false
    }
}

const getCommentByTimelineId = async () => {
    try {
        const responseComment = await $fetch<BaseResponse>(
            `${base_url}/comment/${timeline_id}/${page.value}/${itemPerPage.value}`,
            { method: 'GET' }
        );
        if (responseComment.success) {
            const data = responseComment.data as CommentsData
            comments.value = comments.value.concat(data.comments);
            page.value = data.next_page
        } else {
            console.log(responseComment.message)
        }
    } catch (error) {
        console.log(error)
    } finally {
        loadingMore.value = false
    }
}

const loadMore = async () => {
    if (!loadingMore.value) {
        loadingMore.value = true
        await getCommentByTimelineId();
    }
};

const refreshComment = async (newComment: any) => {
    console.log(newComment)
    const comment = newComment as Comment
    comments.value.unshift(comment)
}

onBeforeMount(async () => {
    loading.value = true
    try {
        await getTimelineById();
    } catch (error) {
        console.log(error)
    }
})
</script>

<style></style>