<template>
    <div>
        <NuxtLoadingIndicator />
        <div v-if="isAuthLoading">
            <NuxtLayout>
                <SplashScreen />
            </NuxtLayout>
        </div>
        <div v-else-if="user">
            <NuxtLayout :user="user">
                <NuxtPage />
            </NuxtLayout>
        </div>
        <div v-else>
            <NuxtLayout>
                <AuthPage/>
            </NuxtLayout>
        </div>

        <UiToastToaster />
    </div>
</template>

<script lang="ts" setup>
const { useAuthUser, initAuth, useAuthLoading } = useAuth()
const user = useAuthUser()
const isAuthLoading = useAuthLoading()

onBeforeMount (() => {
    initAuth()
})

</script>