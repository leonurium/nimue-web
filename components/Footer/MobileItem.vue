<template>
    <NuxtLink :to="props.href"
        class="group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-secondary-foreground/60 bg-background/90 backdrop-blur hover:text-primary-foreground hover:bg-primary"
        :class="{
            'text-primary-foreground': props.active,
            'bg-primary': props.active
        }">
        <Icon :name="props.icon ?? 'home'" size="24px" />
    </NuxtLink>
</template>
    
<script lang="ts" setup>
const props = defineProps({
    label: {
        type: String,
        required: false
    },
    href: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false,
        default: 'bi:house'
    },
    active: {
        type: Boolean,
        required: false,
        default: false
    }
})

</script>