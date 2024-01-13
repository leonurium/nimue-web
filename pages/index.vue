<template>
    <div>
        <UiContainer as="section" class="max-w-2xl py-5 overflow-y-auto">
            <div v-if="loading && !loadingMore">
                <CardThreadsSkeleton />
            </div>
            <div v-else>
                <div v-if="timelines.length > 0">
                    <ListThreads :timelines="timelines"></ListThreads>
                </div>
                <div v-else class="flex flex-col gap-2 items-center">
                    <IconGanttChartSquare />
                    <p>{{ responseMessage }}</p>
                </div>

                <div v-if="loadingMore">
                    <CardThreadsSkeleton />
                </div>
                <UiButton v-else @click="loadTimelineData" class="items-center">Load More</UiButton>
            </div>
        </UiContainer>
    </div>
</template>

<script lang="ts" setup>
import { type BaseResponse, type Timeline } from '@/types/timeline';

const base_url = useRuntimeConfig().public.base_api_url;
const itemPerPage = ref(10);
const page = ref(1);
const loading = ref(false);
const loadingMore = ref(false);
const responseMessage = ref("No Thread Today :)");
const timelines = ref<Timeline[]>([]);

const loadTimelineData = async () => {
    try {
        const responseTimeline = await $fetch<BaseResponse>(
            `${base_url}/timeline/B6961C40-5D18-48FE-B06C-1314B34162CC/${page.value}/${itemPerPage.value}`,
            { method: 'GET' }
        );
        console.log(responseTimeline);
        if (responseTimeline.success) {
            page.value = responseTimeline.data.next_page;
            responseMessage.value = responseTimeline.message
            timelines.value = timelines.value.concat(responseTimeline.data.timelines);
            // timelines.value = [...timelines.value, ...responseTimeline.data.timelines];
            responseMessage.value = responseTimeline.message;
        } else {
            responseMessage.value = responseTimeline.message
            console.log(responseMessage.value)
        }
    } catch (error) {
        responseMessage.value = `${error}`
        console.error('Error loading timeline data:', error);

    } finally {
        loading.value = false;
        loadingMore.value = false
    }
};

const loadMore = async () => {
    if (!loadingMore.value) {
        loadingMore.value = true
        await loadTimelineData();
    }
};

onBeforeMount(async () => {
    loading.value = true
    try {
        await loadTimelineData()
    } catch (error) {
        responseMessage.value = `${error}`
        console.log(error)
    }
})
</script>
