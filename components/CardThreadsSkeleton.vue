<template>
    <div class="flex flex-col gap-10">
        <UiCard class="rounded-lg">
            <div class="flex flex-col gap-5 p-6">
                <div class="flex w-full">
                    <div class="flex items-center space-x-4">
                        <UiSkeleton class="h-12 w-12 rounded-full" />
                        <div class="space-y-2">
                            <UiSkeleton class="h-4 w-[250px]" />
                            <UiSkeleton class="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-3 w-full">
                    <UiSkeleton class="h-8 w-full" />
                    <UiSkeleton class="h-8 w-full" />
                    <UiSkeleton class="h-8 w-[300px]" />
                </div>
            </div>
        </UiCard>
        <UiCard class="rounded-lg">
            <div class="flex flex-col gap-5 p-6">
                <div class="flex w-full">
                    <div class="flex items-center space-x-4">
                        <UiSkeleton class="h-12 w-12 rounded-full" />
                        <div class="space-y-2">
                            <UiSkeleton class="h-4 w-[250px]" />
                            <UiSkeleton class="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-3 w-full">
                    <UiSkeleton class="h-8 w-full" />
                    <UiSkeleton class="h-8 w-full" />
                    <UiSkeleton class="h-8 w-[300px]" />
                </div>
            </div>
        </UiCard>
    </div>
</template>