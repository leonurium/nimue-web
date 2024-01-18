<template>
    <div>
        <NuxtLoadingIndicator />
        <NuxtLayout v-if="user">
            <NuxtPage />
        </NuxtLayout>
        <AuthPage v-else />


        <UiToastToaster />
    </div>
</template>

<script lang="ts" setup>
const { useAuthUser, initAuth } = useAuth()
const user = useAuthUser()

onBeforeMount (() => {
    initAuth()
})

</script>