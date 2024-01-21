<template>
    <UiDialog>
        <UiDialogTrigger as-child>
            <UiButton variant="ghost" class="rounded-full">
                <IconMoreHorizontal />
            </UiButton>
        </UiDialogTrigger>

        <UiDialogContent class="sm:max-w-md" title="More" description="Choose button below">
            <template #content>
                <UiDialogClose as-child>
                    <div v-if="props.isOwnerThread" class="flex flex-col w-full max-w-sm mx-auto gap-2">
                        <UiButton @click="handleDelete" variant="destructive">Delete</UiButton>
                    </div>
                    <div v-else class="flex flex-col w-full max-w-sm mx-auto gap-2">
                        <UiButton @click="handleSendChat">Send Chat</UiButton>
                        <UiButton @click="hanldeReport" variant="destructive">Report</UiButton>
                    </div>
                </UiDialogClose>
            </template>
            <template #footer>
                <UiDialogFooter class="w-full max-w-sm mx-auto">
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
    isOwnerThread: {
        type: Boolean,
        required: true
    }
})

const emits = defineEmits([
    'onClickSendChat',
    'onClickReport',
    'onClickDelete'
])

function handleSendChat() {
    emits('onClickSendChat', props.timeline_id)
}

function hanldeReport() {
    emits('onClickReport', props.timeline_id)
}

function handleDelete() {
    emits('onClickDelete', props.timeline_id)
}


</script>
  