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
                        <IconSquarePen class="lg:hidden h-4 w-4" />
                    </UiButton>

                    <UiDropdownMenu>
                        <UiDropdownMenuTrigger asChild>
                            <UiButton class="h-10 w-10 rounded-full" variant="ghost">
                                <UiAvatar class="h-10 w-10 scale-x-[-1] rounded-full border-2 border-primary hover:border-none"
                                    :src="props.user?.avatar ?? ''"
                                    :fallback="getInitials(props.user?.name ?? 'Netijen Curhat')" />
                            </UiButton>
                        </UiDropdownMenuTrigger>
                        <UiDropdownMenuContent class="w-56">
                            <template v-for="(item, i) in menuitems" :key="i">
                                <UiDropdownMenuLabel v-if="item.label" :label="item.label" />
                                <UiDropdownMenuSeparator v-else-if="item.divider" />
                                <UiDropdownMenuItem v-else @select="item.select" :title="item.title" :icon="item.icon"/>
                            </template>
                        </UiDropdownMenuContent>
                    </UiDropdownMenu>
                </div>
            </UiContainer>
        </UiNavbar>
        <slot />
        <FooterMobile :routes="routes" />
    </div>
</template>
  
<script lang="ts" setup>
import type { User } from '~/types/user';
const { getAppName } = usePreferencesService()
const appName = getAppName()

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

const menuitems = [
    { label: "Account" },
    { divider: true },
    { title: "Logout", icon: "bi:box-arrow-right", select: handleLogout },
];

function handleClickLogo() {
    navigateTo('/')
}

function handleNewPost() {
    navigateTo('/new')
}

async function handleLogout() {
    await logout()
        .finally(() => {
            location.reload()
        })
}

</script>