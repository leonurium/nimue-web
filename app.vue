<template>
    <div>
        <NuxtLoadingIndicator />
        <div v-if="isAuthLoading">
            <SplashScreen />
        </div>
        <div v-else-if="user">
            <NuxtLayout :user="user">
                <NuxtPage class="h-[calc(100svh-56px-56px)]" />
                <CookieControl locale="en" />
            </NuxtLayout>
        </div>
        <div v-else>
            <!-- <NuxtLayout> -->
            <AuthPage />
            <!-- </NuxtLayout> -->
        </div>

        <UiToastToaster />
    </div>
</template>

<script lang="ts" setup>

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

onBeforeMount(() => {
    initAuth()
        .then((result) => {
            if (result && !socket().connected) {
                authSocket()
            }
        });
});

</script>