<template>
    <div>
        <NuxtLoadingIndicator />
        <div v-if="isAuthLoading">
            <SplashScreen />
        </div>
        <div v-else-if="user">
            <NuxtLayout :user="user">
                <NuxtPage class="h-[calc(100svh-56px-56px)]" />
            </NuxtLayout>
        </div>
        <div v-else>
            <NuxtLayout>
                <AuthPage />
            </NuxtLayout>
        </div>

        <UiToastToaster />
    </div>
</template>

<script lang="ts" setup>

const { useAuthUser, initAuth, useAuthLoading } = useAuth()
const { authSocket, socket } = useSocket()

const user = useAuthUser()
const isAuthLoading = useAuthLoading()

onBeforeMount(() => {
    initAuth()
        .then((result) => {
            if (result && !socket().connected) {
                authSocket()
            }
        });
});

</script>