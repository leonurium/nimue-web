<template>
    <div>
        <UiNavbar sticky>
            <UiContainer class="flex h-14 items-center justify-between">
                <p @click="handleClickLogo" class="text-lg font-semibold">{{ appName }}</p>
                <div class="flex items-center gap-2">
                    <UiButton
                        class="rounded-full"
                        @click="$colorMode.preference = $colorMode.value == 'dark' ? 'light' : 'dark'"
                        variant="ghost"
                        size="icon-sm"
                    >
                        <IconSunMedium class="h-4 w-4"/>
                    </UiButton>
                    <UiButton
                        v-if="user"
                        @click="handleNewPost"
                        size="sm"
                        >
                        New Post
                    </UiButton>
                    <UiButton v-if="user" @click="" variant="secondary" size="sm">
                        Logout
                    </UiButton>
                </div>
            </UiContainer>
        </UiNavbar>
        <slot />
        <BottomNavbar class="max-w-2xl mx-auto rounded-full" sticky>
            <UiContainer class="flex h-14 items-center justify-around">
                <NuxtLink to="/">
                    <IconHome/>
                </NuxtLink>
                <NuxtLink to="/chats/">
                    <IconMessageCircle/>
                </NuxtLink>
            </UiContainer>
        </BottomNavbar>
    </div>
</template>
  
<script lang="ts" setup>
import type { User } from '~/types/user';
const appName = useRuntimeConfig().public.app_name

const props = defineProps({
    user: {
        type: Object as () => User,
        default: undefined,
        required: false
    }
})

function handleClickLogo() {
    navigateTo('/', { external: true })
}

function handleNewPost() {
    navigateTo('/new', { external: true })
}

</script>