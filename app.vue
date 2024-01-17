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
const { useAuthUser } = useAuth()
const user = useAuthUser()
</script>