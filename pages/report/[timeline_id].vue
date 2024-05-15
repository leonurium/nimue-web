<template>
    <div class="overflow-auto h-[calc(100svh-56px-56px)] p-6">
        <CardThreads :timeline="timeline" compact />
        <UiDivider class="pt-3 pb-3" />
        <form @submit="onSubmit">
            <Field name="reason" v-slot="{ componentField }">
                <UiFormItem class="space-y-5">
                    <p class="text-lg font-medium">Why are you reporting this post?</p>
                    <p class="text-sm font-normal">Your report is anonymous, except if you're reporting an intellectual
                        property infringement. if someone is in immediate danger, call the local emergency services -
                        don't
                        wait.</p>
                    <UiRadioGroup v-bind="componentField">
                        <UiFormItem v-for="reason in reasons" hideMessage
                            class="flex flex-row-reverse items-center justify-center gap-3 space-y-0" :label="reason">
                            <UiRadioGroupItem :value="reason" />
                        </UiFormItem>
                    </UiRadioGroup>
                </UiFormItem>
            </Field>
            <div class="mt-6">
                <UiButton variant="destructive" type="submit" :disabled="loadingReport">Report
                </UiButton>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
import { TypeMessage } from "~/types";
import type { Timeline } from "~/types/Timeline";
import type { User } from "~/types/User";

const { timeline_id } = useRoute().params
const { getReportReasons } = usePreferencesService()
const { report } = useReport()
const { useAuthUser } = useAuth()
const { getTimelineById } = useTimelineService()
const { showMessage } = useMessage()
const user = useAuthUser().value as User
const timeline = ref<Timeline>()
const reasons: [string] = getReportReasons()
const loadingReport = ref(false)

const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(
        z.object({
            reason: z.enum(reasons, {
                required_error: "You need to select a violation type.",
            }),

        })
    ),
});

const onSubmit = handleSubmit(async (values) => {
    loadingReport.value = true
    await report(
        user.user_id,
        timeline.value?.user.user_id ?? "",
        values['reason'],
        String(timeline.value?.timeline_id ?? ""),
        timeline.value?.text_content ?? ""
    )
        .then(() => {
            showMessage(`Report message has been sent with reason flag ${values['reason']}`, TypeMessage.success)
            setTimeout(() => {
                navigateTo('/')
            }, 3000)
        })
        .catch((error) => {
            showMessage(error, TypeMessage.destructive)
        })
        .finally(() => {
            loadingReport.value = false
        })
});

onBeforeMount(async () => {
    await getTimelineById(Number(timeline_id))
        .then((result) => {
            const data = result as Timeline
            timeline.value = data
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {

        })
})

</script>

<style></style>