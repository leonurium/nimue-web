<template>
    <UiDialog>
        <UiDialogTrigger as-child>
            <UiButton variant="ghost" class="rounded-full">
                <IconShare />
            </UiButton>
        </UiDialogTrigger>

        <UiDialogContent class="sm:max-w-md" title="Share"
            description="Share this content with your friends to spread love and wisdom.">
            <template #content>
                <div class="flex items-center space-x-2">
                    <div class="grid flex-1 gap-2">
                        <UiLabel for="link" class="sr-only"> Link </UiLabel>
                        <UiTextarea v-if="(props.contentToShare?.length ?? 0) > 32" id="link"
                            :model-value="props.contentToShare ?? ''" readOnly />
                        <UiInput v-else id="link" :model-value="props.contentToShare ?? ''" readOnly />
                    </div>
                    <UiDialogClose as-child>
                        <UiButton @click="copyValue" type="submit" size="icon" class="px-3">
                            <span class="sr-only">Copy</span>
                            <IconCopy class="h-4 w-4" />
                        </UiButton>
                    </UiDialogClose>
                </div>
            </template>
            <template #footer>
                <UiDialogFooter class="sm:justify-start">
                    <UiDialogClose as-child>
                        <UiButton variant="secondary">Close</UiButton>
                    </UiDialogClose>
                </UiDialogFooter>
            </template>
        </UiDialogContent>
    </UiDialog>
</template>
  
<script lang="ts" setup>

const props = defineProps({
    timeline_id: {
        type: Number,
        required: true
    },
    urlToShare: {
        type: String,
        required: false
    },
    contentToShare: {
        type: String,
        required: false

    }
})

const emits = defineEmits([
    'onCopyContent'
])

const copyToShare = `${props.contentToShare ?? ""} \n\n ${props.urlToShare ?? ""}`

const copyValue = () => {
    const { isSupported, copy } = useClipboard({ legacy: true });
    if (isSupported.value) {
        copy(copyToShare);
        emits('onCopyContent', props.timeline_id)
        useToast().toast({
            title: "Copied",
            description: `The content has been copied to your clipboard.`,
            duration: 5000,
            icon: "lucide:thumbs-up",
        });
        return;
    } else {
        useToast().toast({
            title: "Not supported",
            description: `Your browser does not support copying to clipboard.`,
            duration: 5000,
            icon: "lucide:thumbs-down",
        });
        return;
    }
};
</script>
  