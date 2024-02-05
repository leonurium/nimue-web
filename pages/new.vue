<template>
    <UiContainer as="section" class="max-w-2xl h-screen py-5">
        <UiCardContent as="form" @submit="onSubmit" class="flex flex-col gap-4">
            <Field v-slot="{ componentField }" name="text_content">
                <UiFormItem label="Mau Curhat Apa?">
                    <UiTextarea
                        resize
                        placeholder="What is in your heart?"
                        v-bind="componentField"
                    />
                </UiFormItem>
            </Field>
            <UiButton :disabled="loading" type="submit">Post
                <IconSquarePen
                    class="h-4 w-4"
                    :class="{
                        'animate-pulse': loading
                    }"
                />
            </UiButton>
        </UiCardContent>
    </UiContainer>
</template>

<script lang="ts" setup>
import { z } from "zod";
import { TypeMessage } from "~/types";
import type { User } from "~/types/user";

const { newTimeline } = useTimelineService()
const { showMessage } = useMessage()
const { useAuthUser } = useAuth()
const user = useAuthUser().value as User
const loading = ref(false)

const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(
        z.object({
            text_content: z
                .string({
                    required_error: "Tulis dulu, mau curhat apa?"
                })
                .min(5, "Minimal 5 character")
        })
    ),
});

const onSubmit = handleSubmit( async (values) => {
    loading.value = true
    await newTimeline(user.user_id, user.name, values['text_content'])
        .then((result) => {
            showMessage("Successfully posted!", TypeMessage.success)
            setTimeout(() => {
                navigateTo('/')
            }, 2000);
        })
        .catch((error) => {
            showMessage(error, TypeMessage.destructive)
        })
        .finally(() => {
            loading.value = false
        })
});
</script>