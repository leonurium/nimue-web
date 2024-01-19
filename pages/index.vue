<template>
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

            <div class="pt-10" v-if="loadingMore">
                <CardThreadsSkeleton />
            </div>
            <Observer v-else @intersect="loadMore"/>
        </div>
    </UiContainer>
</template>

<script lang="ts" setup>
import type { BaseResponse, Timeline, TimelinesData } from '@/types/timeline';
import Observer from "@/components/Observer.vue";

const base_url = useRuntimeConfig().public.base_api_url;
const device_id = ref('B6961C40-5D18-48FE-B06C-1314B34162CC')
const itemPerPage = ref(10);
const page = ref(1);
const loading = ref(true);
const loadingMore = ref(false);
const responseMessage = ref("Mau curhat apa?");
const timelines = ref<Timeline[]>([]);

const { getDeviceId } = useDevice()

const registerDevice = async () => {
    const deviceId = getDeviceId()
    console.log(deviceId)
    try {
        const responseRegisterDevice = await $fetch<BaseResponse>(
            `${base_url}/register/device/`,
            {
                method: 'POST',
                body: {
                    "device_id": deviceId
                }
            }
        );
        console.log(responseRegisterDevice);
    } catch (error) {
        console.log(error)
    } finally {

    }
};


const getPreference = async () => {
    try {
        const responsePreference = await $fetch<BaseResponse>(
            `${base_url}/preference/`,
            { method: 'GET' }
        );
        console.log(responsePreference);
    } catch (error) {
        console.log(error)
    } finally {

    }
};

const getTimelines = async () => {
    try {
        const responseTimeline = await useFetchApi(
            `${base_url}/timeline/${device_id.value}/${page.value}/${itemPerPage.value}`,
            { method: 'GET' }
        );
        if (responseTimeline.success) {
            const data = responseTimeline.data as TimelinesData
            page.value = data.next_page;
            responseMessage.value = responseTimeline.message
            timelines.value = timelines.value.concat(data.timelines);
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
        await getTimelines();
    }
};

onBeforeMount(async () => {
    loading.value = true
    try {
        await getTimelines()
        await registerDevice()
    } catch (error) {
        responseMessage.value = `${error}`
        console.log(error)
    }
})
</script>
