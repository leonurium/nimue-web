<template>
    <div>
        <UiCard class="shadow-lg rounded-lg" v-for="timeline in props.timelines">
            <div class="flex flex-col gap-5 p-6" v-if="false">
                <div class="flex w-full">
                    <div class="flex items-center space-x-4">
                        <UiAvatar class="h-12 w-12 rounded-full text-" fallback="A" />
                        <div class="space-y-2">
                            <h1 class="h-4 text-lg font-bold">  </h1>
                            <h5 class="h-4 text-xs"> </h5>
                        </div>
                    </div>
                    <div class="ml-auto">
                        <IconMoreHorizontal />
                    </div>
                </div>
                <div class="w-full text-lg">
                    {{ timeline }}
                </div>
                <div class="flex items-center gap-2">
                    <!-- <IconHeart class="text-red-500"/> -->
                    <UiButton class="bg-clear text-gray-800 dark:text-gray-50">
                        <IconHeart />
                    </UiButton>
                    <UiButton class="bg-clear text-gray-800 dark:text-gray-50">
                        <IconMessageCircle />
                    </UiButton>
                    <div class="ml-auto">
                        <IconShare />
                    </div>
                </div>
            </div>

            <div v-else>
                <UiCard>{{timeline}}</UiCard>
            </div>
        </UiCard>
    </div>
</template>

<script lang="ts" setup>
import {type Timeline } from '@/types/timeline';
const props = defineProps({
    timelines: {
        type: Array,
        required: true
    }
})
</script>

<style></style>