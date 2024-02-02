<template>
    <div class="sticky w-full justify-between bottom-0 z-40 flex items-center border-t">
        <FooterMobileItem v-for="route in props.routes" :href="route.href" :icon="route.icon" :active="route.active"></FooterMobileItem>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    routes: {
        type: Object as () => NavRoute[],
        required: true
    }
})
</script>