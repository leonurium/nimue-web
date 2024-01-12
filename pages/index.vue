<template>
    <div>
        <UiContainer as="section" class="max-w-2xl py-5 h-screen overflow-y-auto">
            <div v-if="responseIsSuccess" class="flex flex-col gap-5 items-center">
                <!-- add icon here -->
                <p>{{ responseMessage }}</p>
            </div>
            <div v-else class="flex flex-col rounded-lg gap-10">
                <ListThreads :timelines="timelines2"/>
                <UiCard class="shadow-lg rounded-lg" v-for="timeline in timelines" :key="timeline.timeline_id">
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
                                <IconMoreHorizontal />
                            </div>
                        </div>
                        <div class="w-full text-lg">
                            {{ timeline.text_content }}
                        </div>
                        <div class="flex items-center gap-2">
                            <!-- <IconHeart class="text-red-500"/> -->
                            <UiButton class="bg-clear text-gray-800 dark:text-gray-50">
                                <IconHeart />{{ timeline.total_likes }}
                            </UiButton>
                            <UiButton class="bg-clear text-gray-800 dark:text-gray-50">
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
                <UiButton v-if="!loading" @click="loadTimelineData" class="items-center">Load More</UiButton>
                <p v-else>Loading more...</p>
            </div>
        </UiContainer>
    </div>
</template>

<script lang="ts" setup>
    import {type BaseResponse, type Timeline } from '@/types/timeline';

    const { getTimelines } = useTimelines()
    const timelines2 = ref([])
    const base_url = useRuntimeConfig().public.base_api_url;
    const page = ref(1);
    const itemPerPage = 10;
    const loading = ref(false);
    const responseIsSuccess = ref(false);
    const responseMessage = ref("message");
    const timelines = ref<Timeline[]>([]);

    const loadTimelineData = async () => {
        console.log('loadingTimelineData called');
        try {
            console.log('entry try');
            loading.value = true;
            const { data: responseTimeline } = await useFetch<BaseResponse>(
                `${base_url}/timeline/B6961C40-5D18-48FE-B06C-1314B34162CC/${page.value}/${itemPerPage}`,
                {mode: 'no-cors'}
            );
            console.log(responseTimeline);
            if (
                responseTimeline &&
                responseTimeline.value &&
                responseTimeline.value.success
            ) {
                console.log('entry success');
                // timelines.value = timelines.value.concat(responseTimeline.value.data.timelines);
                timelines.value = [...timelines.value, ...responseTimeline.value.data.timelines];
                page.value = responseTimeline.value.data.next_page;
                responseMessage.value = responseTimeline.value.message;
                loading.value = false
                console.log(responseMessage.value);
            } else {
                console.log(responseTimeline)
            }
        } catch (error) {
            responseMessage.value = `${error}`
            loading.value = false
            console.error('Error loading timeline data:', error);

        } finally {
            console.log('entry finally');
            loading.value = false;
        }
    };

    const loadMore = async () => {
        if (!loading.value) {
            await loadTimelineData();
        }
    };

    onBeforeMount(async () => {
        loading.value = true
        try {
            await getTimelines()
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    })
</script>
