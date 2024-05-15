<template>
    <div class="max-w-2xl mx-auto h-screen">
        <UiNavbar sticky>
            <UiContainer class="flex h-14 items-center justify-between">
                <UiButton class="rounded-full"
                    variant="ghost"
                    size="icon-sm"
                    @click="navBack"
                >
                    <IconChevronLeft/>
                </UiButton>
                <div class="flex flex-row items-center">
                    <p class="text-base font-semibold pr-3">{{ user?.name }}</p>
                    <ChatStatusIcon :isOnline="user?.is_online" />
                    <span v-if="user?.is_online" class="text-secondary-foreground/70 text-[10px] pl-1">online</span>
                    <span v-else class="text-secondary-foreground/70 text-[10px] pl-1">offline</span>
                </div>
                <div class="flex items-center gap-2">
                    <UiButton class="rounded-full"
                        @click="$colorMode.preference = $colorMode.value == 'dark' ? 'light' : 'dark'" variant="ghost"
                        size="icon-sm">
                        <IconSunMedium class="h-4 w-4" />
                    </UiButton>
                </div>
            </UiContainer>
        </UiNavbar>
        <slot />
        <FooterMobile :routes="routes"/>
    </div>
</template>
  
<script lang="ts" setup>
import type { User } from '~/types/User';

const props = defineProps({
    user: {
        type: Object as () => User,
        default: undefined,
        required: false
    }
})

const { initRoute, navRoutes, navBack } = useNavRoute()
initRoute()
const routes = navRoutes().value as NavRoute[]

</script>