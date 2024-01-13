<template>
    <div class="flex flex-col gap-10">
        <UiCard class="shadow-lg rounded-lg" v-for="timeline in timelines" :key="timeline.timeline_id">
            <div class="flex flex-col gap-5 p-6" v-if="!timeline.is_ads">
                <div class="flex w-full">
                    <div class="flex items-center space-x-4">
                        <UiAvatar class="h-12 w-12 rounded-full" :fallback="getInitials(timeline.name)" />
                        <div class="space-y-2">
                            <h1 class="h-4 text-lg font-bold"> {{ timeline.name }} </h1>
                            <h5 class="h-4 text-xs"> {{ getTimeAgo(timeline.timed) }} </h5>
                        </div>
                    </div>
                    <div class="ml-auto">
                        <IconMoreHorizontal />
                    </div>
                </div>
                <div class="w-full text-lg">
                    {{ timeline.text_content }}
                </div>
                <div class="flex items-center gap-2">
                    <!-- <IconHeart class="text-red-500"/> -->
                    <UiButton class="rounded-full bg-clear text-gray-800 dark:text-gray-50 hover:bg-gray-200">
                        <IconHeart />{{ timeline.total_likes }}
                    </UiButton>
                    <UiButton class="rounded-full bg-clear text-gray-800 dark:text-gray-50 hover:bg-gray-200">
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
import type { Timeline } from '@/types/timeline';

const props = defineProps<{
    timelines: Timeline[]
}>();
</script>

<style></style>