<template>
    <div class="flex flex-col overflow-scroll h-[calc(100svh-56px-56px-76px-12px)] p-6">
        <div v-if="loading">
            <CardThreadsSkeleton />
        </div>
        <div v-else>
            <CardThreads :timeline="timeline" compact />

            <UiDivider class="pt-4 pb-4" />

            <div v-if="comments.length > 0">
                <UiContainer v-for="comment in comments" as="section" class="p-0">
                    <CommentView :key="comment.comment_id" :commentData="comment" />
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
    </div>
    <ReplyForm class="sticky bottom-14 border-t" :user="user" @onSubmit="handleRepy"/>
</template>

<script lang="ts" setup>
import type { User } from '~/types/User';
import type { Timeline } from '@/types/Timeline';
import type { CommentsData, Comment } from '~/types/Comment';

const { getTimelineById } = useTimelineService()
const { getCommentByTimelineId } = useCommentService()
const { getAppName } = usePreferencesService()
const { addNewReply } = useCommentService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const { timeline_id } = useRoute().params
const itemPerPage = ref(10);
const page = ref(1);
const timeline = ref<Timeline>()
const comments = ref<Comment[]>([])
const loading = ref(true)
const loadingMore = ref(false)

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

const handleRepy = async (replyText: string) => {
    await addNewReply(user, timeline.value?.timeline_id ?? 1, replyText)
        .then((result) => {
            console.log(result)
            const comment = result as Comment
            comments.value.unshift(comment)
        })
        .catch((error) => {
            console.log(error)
        })
}

onBeforeMount(() => {
    loading.value = true

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
    ogTitle: `${timeline.value?.user.name} - ${getAppName()}`,
    ogDescription: timeline.value?.text_content,
    ogImage: '[og:image]',
    ogUrl: window.location.href,
    twitterTitle: `${timeline.value?.user.name} - ${getAppName()}`,
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