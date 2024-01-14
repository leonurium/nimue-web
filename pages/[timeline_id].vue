<template>
    <UiContainer class="max-w-2xl p-6">
        <div v-if="loading">
            <CardThreadsSkeleton />
        </div>
        <div v-else>
            <div class="flex w-full">
                <div class="flex items-center space-x-4">
                    <UiAvatar class="h-10 w-10 rounded-full" :fallback="getInitials(timeline?.name ?? 'Netijen Curhat')" />
                    <div class="space-y-2">
                        <h1 class="h-4 text-base font-bold"> {{ timeline?.name }} </h1>
                        <h5 class="h-4 text-xs"> {{ getTimeAgo(timeline?.timed ?? "") }} </h5>
                    </div>
                </div>
                <div class="ml-auto">
                    <IconMoreHorizontal />
                </div>
            </div>
            <div class="w-full text-base pt-4 pb-4">
                {{ timeline?.text_content }}
            </div>
            <div class="flex items-center gap-5">
                <p class="text-sm text-gray-500">
                    {{
                        timeline?.total_likes +
                        ((timeline?.total_likes ?? 0) > 1 ? " likes" : " like")
                    }}
                </p>
                <p class="text-sm text-gray-500">
                    {{
                        timeline?.total_comments +
                        ((timeline?.total_comments ?? 0) > 1 ? " replies" : " reply")
                    }}
                </p>
            </div>

            <UiDivider class="pt-4 pb-4" />

            <div v-if="comments.length > 0">
                <UiContainer v-for="comment in comments" as="section" class="p-0 overflow-y-auto">
                    <div class="flex w-full">
                        <div class="flex items-center space-x-4">
                            <UiAvatar class="h-10 w-10 rounded-full"
                                :fallback="getInitials(comment.name)" />
                            <div class="space-y-2">
                                <h1 class="h-4 text-base font-bold">
                                    {{ comment.name }}
                                    <span class="text-xs font-normal text-gray-500 pl-1">
                                        {{ getTimeAgo(comment.timed) }}
                                    </span>
                                </h1>
                                <h1 class="text-base">
                                    {{ comment.text_content }}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <UiDivider class="pt-4 pb-4" />
                </UiContainer>
            </div>

            <div v-else>
                no comment
            </div>
            <Observer v-else @intersect="loadMore"/>

        </div>
        <ReplyForm/>

    </UiContainer>
</template>

<script lang="ts" setup>
import { type BaseResponse, type Timeline, type CommentsData, type Comment } from '@/types/timeline';
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
        console.log(responseComment)
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