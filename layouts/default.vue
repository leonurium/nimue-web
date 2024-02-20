<template>
    <div class="max-w-2xl mx-auto h-screen">
        <UiNavbar sticky>
            <UiContainer class="flex h-14 items-center justify-between">
                <p @click="handleClickLogo" class="text-lg font-semibold">{{ appName }}</p>
                <div class="flex items-center gap-2">
                    <UiButton class="rounded-full"
                        @click="$colorMode.preference = $colorMode.value == 'dark' ? 'light' : 'dark'" variant="ghost"
                        size="icon-sm">
                        <IconSunMedium class="h-4 w-4" />
                    </UiButton>
                    <UiButton v-if="user" @click="handleNewPost" size="sm">
                        <span class="hidden lg:block">New Post</span>
                        <IconSquarePen class="lg:hidden h-4 w-4"/>
                    </UiButton>
                    <UiButton v-if="user" @click="handleLogout" variant="secondary" size="sm">
                        <span class="hidden lg:block">Logout</span>
                        <IconLogOut class="lg:hidden h-4 w-4"/>
                    </UiButton>
                </div>
            </UiContainer>
        </UiNavbar>
        <slot />
        <FooterMobile :routes="routes" />
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

const { logout } = useAuth()
const { navRoutes, initRoute } = useNavRoute()
initRoute()
const routes = navRoutes().value as NavRoute[]

function handleClickLogo() {
    navigateTo('/')
}

function handleNewPost() {
    navigateTo('/new')
}

function handleLogout() {
    logout()
}

</script>