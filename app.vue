<template>
    <div>
        <VitePwaManifest />
        <NuxtLoadingIndicator />
        <div v-if="isAuthLoading">
            <NuxtLayout name="empty">
                <SplashScreen />
            </NuxtLayout>
        </div>
        <div v-else-if="user">
            <NuxtLayout :user="user">
                <NuxtPage class="h-[calc(100svh-56px-56px)]" />
                <CookieControl locale="en">
                    <template #modal>
                        <h2>We value your privacy</h2>
                        <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and
                            analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                    </template>
                    <template #cookie="{ cookie }">
                        <h3 v-text="cookie.name" />
                        <span v-html="cookie.description" />

                        <div v-if="cookie.targetCookieIds">
                            <b>Cookie ids: </b>
                            <span v-text="cookie?.targetCookieIds?.join(', ')" />
                        </div>
                    </template>
                </CookieControl>
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
const { useAuthUser, initAuth, useAuthLoading } = useAuth()
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
const { getUrls } = usePreferencesService()
const socket = useSocket.getInstance()

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
            // init socket
            // const socketURL = useRuntimeConfig().public.base_socket_url
            const socketURL = getUrls()?.socket_server ?? useRuntimeConfig().public.base_socket_url
            socket.set(socketURL)
            socket.establishConnection()

            return await navigateTo("/")
        }
    }
}, { deep: true })

onBeforeMount(() => {
    initAuth()
        .then((result) => {
            if (result) {
                // init socket
                // const socketURL = useRuntimeConfig().public.base_socket_url
                const socketURL = getUrls()?.socket_server ?? useRuntimeConfig().public.base_socket_url
                socket.set(socketURL)
                socket.establishConnection()
            }
        })
        .catch(async (error) => {
            if (![
                "login",
                "register",
                "user-agreement",
                "privacy-policy",
                "about",
                "contact-us"
            ].includes(route.name?.toString() ?? "")) {
                return await navigateTo("/login")
            }
        })
})

</script>