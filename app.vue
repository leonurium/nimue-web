<template>
    <div>
        <NuxtLoadingIndicator />
        <div v-if="isAuthLoading">
            <NuxtLayout name="empty">
                <SplashScreen />
            </NuxtLayout>
        </div>
        <div v-else-if="user">
            <NuxtLayout :user="user">
                <NuxtPage class="h-[calc(100svh-56px-56px)]" />
                <CookieControl locale="en" />
            </NuxtLayout>
        </div>
        <div v-else>
            <NuxtLayout name="empty">
                <NuxtPage />
            </NuxtLayout>
        </div>

        <UiToastToaster />
    </div>
</template>

<script lang="ts" setup>
import type { User } from './types/user';

const { useAuthUser, initAuth, useAuthLoading } = useAuth()
const { authSocket, socket } = useSocket()
const {
    cookiesEnabled,
    cookiesEnabledIds,
    isConsentGiven,
    isModalActive,
    moduleOptions
} = useCookieControl()

const user = useAuthUser()
const isAuthLoading = useAuthLoading()
const route = useRoute()

// example: react to a cookie being accepted
watch(
    () => cookiesEnabledIds.value,
    (current, previous) => {
        if (
            !previous?.includes('google-analytics') &&
            current?.includes('google-analytics')
        ) {
            // cookie with id `google-analytics` got added
            window.location.reload() // placeholder for your custom change handler
        }
    },
    { deep: true },
)

watch(user, async (current, previous) => {
    if (current && !previous) {
        if ([
            "login",
            "register"
        ].includes(route.name?.toString() ?? "")) {
            return await navigateTo("/")
        }
    }
}, { deep: true })

onBeforeMount(() => {
    initAuth()
        .then((result) => {
            if (result && !socket().connected) {
                authSocket()
            }
        })
        .catch(async (error) => {
            if (![
                "login",
                "register",
                "user-agreement",
                "privacy-policy"
            ].includes(route.name?.toString() ?? "")) {
                return await navigateTo("/login")
            }
        })
})

</script>