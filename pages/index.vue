<template>
    <div>
        <UiContainer as="section" class="max-w-2xl py-5">
            <div v-if="responseTimeline?.success == false" class="flex flex-col gap-5 items-center">
                <!-- add icon here -->
                <p>{{ responseTimeline.message }}</p>
            </div>
            <div v-else class="flex flex-col overflow-x-auto rounded-lg bg-background gap-10">
                <UiCard v-for="timeline in responseTimeline.data.timelines" :key="timeline.timeline_id">
                    <div class="flex flex-col gap-5 p-6" v-if="timeline.is_ads == false">
                        <div class="flex w-full">
                            <div class="flex items-center space-x-4">
                                <UiAvatar class="h-12 w-12 rounded-full text-" :fallback="getInitials(timeline.name)" />
                                <div class="space-y-2">
                                    <h1 class="h-4 text-lg font-bold"> {{ timeline.name }} </h1>
                                    <h5 class="h-4 text-xs"> {{ getTimeAgo(timeline.timed) }} </h5>
                                </div>
                            </div>
                            <div class="ml-auto">
                                <IconMoreHorizontal/>
                            </div>
                        </div>
                        <div class="w-full text-lg">
                            {{ timeline.text_content }}
                        </div>
                        <div class="flex items-center gap-2">
                            <!-- <IconHeart class="text-red-500"/> -->
                            <UiButton class="bg-clear text-white">
                                <IconHeart/>{{ timeline.total_likes }}
                            </UiButton>
                            <UiButton class="bg-clear text-white">
                                <IconMessageCircle/>{{ timeline.total_comments }}
                            </UiButton>
                            <div class="ml-auto">
                                <IconShare/>
                            </div>
                        </div>
                    </div>

                    <div v-else>
                        <!-- ini iklan -->
                    </div>
                </UiCard>
            </div>
        </UiContainer>
    </div>
</template>

<script lang="ts" setup>
    import { Convert, type BaseResponse } from "./../types/timeline"
    const base_url = useRuntimeConfig().public.base_api_url
    const { data: responseTimeline } = await useFetch<BaseResponse>(base_url+'/timeline/B6961C40-5D18-48FE-B06C-1314B34162CC/1/10');
</script>
