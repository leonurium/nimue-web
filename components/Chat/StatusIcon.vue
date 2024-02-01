<template>
    <span class="relative flex h-2 w-2">
        <span class="absolute inline-flex h-full w-full rounded-full opacity-75"
        :class="{
            'animate-ping': props.isOnline,
            'bg-green-400': props.isOnline,
            'bg-orange-400': !props.isOnline
        }"
        ></span>
        <span class="relative inline-flex rounded-full h-2 w-2"
        :class="{
            'bg-green-500': props.isOnline,
            'bg-orange-500': !props.isOnline
        }"></span>
    </span>
</template>

<script lang="ts" setup>

const props = defineProps({
    isOnline: {
        type: Boolean,
        default: false,
        required: false
    }
})

</script>