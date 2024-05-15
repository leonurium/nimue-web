<template>
    <div class="flex w-full">
        <div class="flex items-center space-x-4">
            <UiAvatar
                class="h-10 w-10 rounded-full"
                :src="props.commentData.avatar"
                :fallback="getInitials(props.commentData.name)"
            />
            <div class="space-y-2">
                <h1 class="h-4 text-base font-bold">
                    {{ props.commentData.name }}
                    <span class="text-xs font-normal text-gray-500 pl-1">
                        {{ getTimeAgo(props.commentData.timed) }}
                    </span>
                </h1>
                <h1 class="text-base">
                    {{ props.commentData.text_content }}
                </h1>
            </div>
        </div>
    </div>
    <UiDivider class="pt-4 pb-4" />
</template>

<script lang="ts" setup>
import type { Comment } from '~/types/Comment';
const props = defineProps({
    commentData: {
        type: Object as () => Comment,
        required: true
    }
})

</script>

<style></style>