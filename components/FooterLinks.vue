<template>
    <div class="flex text-center gap-2">
        <NuxtLink v-for="(item, i) in footerItems" class="text-[10px] text-secondary-foreground/80 p-0 hover:underline"
            :key="i" :to="item?.to">
            {{ item?.title }}
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
let footerItems: { title: string, to: string }[] | undefined[] = [
    { title: "About", to: "/about" },
    { title: "Sign In", to: "/login" },
    { title: "Sign Up", to: "/register" },
    { title: "Privacy Policy", to: "/privacy-policy" },
    { title: "User Agreement", to: "/user-agreement" },
    { title: "Contact Us", to: "/contact-us" },
];

const route = useRoute()
function filterItems() {
    const items = footerItems.map( (item) => {
        if (item && route.path !== item.to) {
            return item
        }
        return undefined
    }).filter(Boolean) as { title: string, to: string }[]
    footerItems = items
}

onBeforeMount(() => {
    filterItems()
})

</script>