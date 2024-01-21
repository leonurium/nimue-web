<template>
    <UiContainer class="max-w-2xl p-6">
        <div v-if="loading">
            <CardThreadsSkeleton />
        </div>
        <div v-else>
            <CardThreads :timeline="timeline" compact />

            <UiDivider class="pt-4 pb-4" />

            <ReplyForm :timeline_id="timeline?.timeline_id ?? 0" @onSubmit="refreshComment" />

            <UiDivider class="pt-4 pb-4" />

            <div v-if="comments.length > 0">
                <UiContainer v-for="comment in comments" as="section" class="p-0 overflow-y-auto">
                    <CommentView :commentData="comment" />
                </UiContainer>
            </div>

            <div v-else>
                no comment
            </div>

            <div class="pt-10" v-if="loadingMore">
                Loading...
            </div>
            <Observer @intersect="loadMore" />
        </div>

    </UiContainer>
</template>

<script lang="ts" setup>
import type { Timeline } from '@/types/timeline';
import type { CommentsData, Comment } from '~/types/comment';

const { getTimelineById } = useTimelineService()
const { getCommentByTimelineId } = useCommentService()
const { getAppName, getPreferences } = usePreferencesService()
const { timeline_id } = useRoute().params
const itemPerPage = ref(10);
const page = ref(1);
const timeline = ref<Timeline>()
const comments = ref<Comment[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const appName = ref('')

const loadMore = async () => {
    if (!loadingMore.value) {
        loadingMore.value = true
        await getCommentByTimelineId(Number(timeline_id), page.value, itemPerPage.value)
            .then((result) => {
                const data = result as CommentsData
                comments.value = comments.value.concat(data.comments)
                page.value = data.next_page
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                loadingMore.value = false
            })
    }
};

const refreshComment = async (newComment: any) => {
    console.log(newComment)
    const comment = newComment as Comment
    comments.value.unshift(comment)
}

onBeforeMount(() => {
    loading.value = true
    
    getPreferences()
        .then(() => {
            appName.value = getAppName()
        })
        
    getTimelineById(Number(timeline_id))
        .then((result) => {
            const data = result as Timeline
            timeline.value = data
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            loading.value = false
        })
})

useSeoMeta({
    description: timeline.value?.text_content,
    ogTitle: `${timeline.value?.name} - ${appName.value}`,
    ogDescription: timeline.value?.text_content,
    ogImage: '[og:image]',
    ogUrl: window.location.href,
    twitterTitle: `${timeline.value?.name} - ${appName.value}`,
    twitterDescription: timeline.value?.text_content,
    twitterImage: '[twitter:image]',
    twitterCard: 'summary'
})

useHead({
    htmlAttrs: {
        lang: 'en'
    },
    link: [
        {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.png'
        }
    ]
})
</script>

<style></style>