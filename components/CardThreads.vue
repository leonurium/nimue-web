<template>
    <div>
        <div class="flex w-full">
            <div class="flex items-center space-x-4">
                <UiAvatar class="h-10 w-10 rounded-full"
                    :fallback="getInitials(props.timeline?.name ?? 'Netijen Curhat')" />
                <div class="space-y-2">
                    <h1 class="h-4 text-base font-bold"> {{ props.timeline?.name }} </h1>
                    <h5 class="h-4 text-xs"> {{ getTimeAgo(props.timeline?.timed ?? "") }} </h5>
                </div>
            </div>
            <div class="ml-auto">
                <IconMoreHorizontal />
            </div>
        </div>
        <div class="w-full text-base text-justify pt-4 pb-4">
            {{ props.timeline?.text_content }}
        </div>

        <div v-if="compact" class="flex items-center gap-5">
            <p class="text-sm text-gray-500">
                {{
                    props.timeline?.total_likes +
                    ((props.timeline?.total_likes ?? 0) > 1 ? " likes" : " like")
                }}
            </p>
            <p class="text-sm text-gray-500">
                {{
                    props.timeline?.total_comments +
                    ((props.timeline?.total_comments ?? 0) > 1 ? " replies" : " reply")
                }}
            </p>
        </div>

        <div v-else class="flex items-center gap-1">
            <UiButton @click="likeClicked(props.timeline?.timeline_id ?? 0)" variant="ghost" class="rounded-full">
                <IconHeart :class="{
                    'text-red-500': props.timeline?.is_liked,
                    'animate-pulse': props.likeIsClicked
                }" />
                <span :class="{
                    'animate-pulse': props.likeIsClicked
                }">{{ props.timeline?.total_likes }}</span>
            </UiButton>
            <UiButton @click="commentClicked(props.timeline?.timeline_id ?? 0)" variant="ghost" class="rounded-full">
                <IconMessageCircle />{{ props.timeline?.total_comments }}
            </UiButton>
            <div class="ml-auto">
                <IconShare />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type Timeline } from '@/types/timeline';
const props = defineProps({
    timeline: {
        type: Object as () => Timeline,
        default: undefined,
        required: true
    },
    likeIsClicked: {
        type: Boolean,
        default: false,
        required: false
    },
    compact: {
        type: Boolean,
        required: false
    }
})

const emits = defineEmits([
    'onClickLike',
    'onClickComment',
    'onClickShare',
    'onClickMore'
])

// const paddingTextContentClasses = computed(() => {
//     if (props.compact) {
//         return `pt-4 pb-4`
//     } else {
//         return `pt-4 pb-4`
//     }
// })

function likeClicked(timeline_id: number) {
    emits('onClickLike', timeline_id)
}

function commentClicked(timeline_id: number) {
    emits('onClickComment', timeline_id)
}

</script>

<style></style>