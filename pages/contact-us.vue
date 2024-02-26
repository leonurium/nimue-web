<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="p-6">
            <h1>Contact Us</h1>
        </div>
        <div class="flex flex-col mt-auto gap-1">
            <NuxtLink v-for="(item, i) in contactItems"
                class="hover:underline" :key="i"
                :to="item.to"  
                target="_blank"          
            >
                <Icon :name="item.icon"/>
                {{ item.title }}
            </NuxtLink>
        </div>

        <div class="mt-auto mb-20">
            <FooterLinks/>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { getContacts } = usePreferencesService()

const contactItems = [
    { title: getContacts()?.email, icon: "ph:envelope", to: `mailto:${getContacts()?.email}` },
    { title: getContacts()?.instagram, icon: "ph:instagram-logo", to: `https://instagram.com/${getContacts()?.instagram}` }
]
</script>