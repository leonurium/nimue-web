<template>
    <UiContainer as="section" class="max-w-2xl h-screen py-5 overflow-y-auto">
        <div v-if="loading && !loadingMore">
            <CardThreadsSkeleton />
        </div>
        <div v-else>
            <div v-if="timelines.length > 0">
                <ListThreads :timelines="timelines"></ListThreads>
                <Observer @intersect="loadMore"/>
            </div>
            <div v-else class="flex flex-col gap-2 items-center">
                <IconGanttChartSquare />
                <p>{{ responseMessage }}</p>
            </div>

            <div class="pt-10" v-if="loadingMore">
                <CardThreadsSkeleton />
            </div>
        </div>
    </UiContainer>
</template>

<script lang="ts" setup>
import type { Timeline, TimelinesData } from '@/types/Timeline'
import type { User } from '@/types/User'
import Observer from "@/components/Observer.vue"

const { getTimelines } = useTimelineService()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const itemPerPage = ref(10);
const page = ref(1);
const loading = ref(true);
const loadingMore = ref(false);
const responseMessage = ref("Mau curhat apa?");
const timelines = ref<Timeline[]>([]);

async function getListTimeline() {
    try {
        await getTimelines(user.user_id, `${page.value}`, `${itemPerPage.value}`)
            .then((result) => {
                const data = result as TimelinesData
                page.value = data.next_page
                timelines.value = timelines.value.concat(data.timelines)
            })
            .catch((error) => {
                responseMessage.value = error
            })
            .finally(() => {
                loading.value = false
                loadingMore.value = false
            })
    } catch (error) {
        responseMessage.value = `${error}`
        console.log(error)
    }
}

const loadMore = async () => {
    if (!loadingMore.value) {
        loadingMore.value = true
        await getListTimeline()
    }
};

onBeforeMount(async () => {
    loading.value = true
    await getListTimeline()
})
</script>
