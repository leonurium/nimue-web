<template>
    <div class="flex h-screen">
        <div class="relative flex-1 hidden w-0 lg:block">
            <img class="absolute inset-0 object-cover w-full h-full" :src="imageRegister" />
        </div>
        <div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="flex flex-col justify-center items-center w-full h-full max-w-sm mx-auto lg:w-96">
                <UiCard class="mt-auto mx-auto max-w-sm" title="Register" description="Daftar dulu kali yee">
                    <template #content>
                        <UiCardContent as="form" @submit="onSubmit" class="flex flex-col gap-4">
                            <Field v-slot="{ componentField }" name="email">
                                <UiFormItem label="Email">
                                    <UiInput type="email" v-bind="componentField" />
                                </UiFormItem>
                            </Field>
                            <Field v-slot="{ componentField }" name="password">
                                <UiFormItem label="Password">
                                    <UiInput type="password" v-bind="componentField" />
                                </UiFormItem>
                            </Field>
                            <Field v-slot="{ componentField }" name="confirm_password">
                                <UiFormItem label="Conrfirm Password">
                                    <UiInput type="password" v-bind="componentField" />
                                </UiFormItem>
                            </Field>
                            <div class="flex flex-col gap-2">
                                <UiButton type="submit" :disabled="loading">Register</UiButton>
                            </div>

                            <p class="text-sm text-center">Already have an account? <NuxtLink class="text-primary"
                                    to="/login" :disabled="loading">Login</NuxtLink>
                            </p>
                        </UiCardContent>
                    </template>
                </UiCard>

                <div class="mt-auto text-sm text-center">
                    <p class="text-sm text-center">By clicking on the "Register" button, you agree to our <NuxtLink
                            class="text-primary" to="/user-agreement" :disabled="loading">User Agreement</NuxtLink> and our <NuxtLink
                            class="text-primary" to="/privacy-policy" :disabled="loading">Privacy Policy</NuxtLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
import { TypeMessage } from "~/types";

const { register, login } = useAuth()
const { showMessage } = useMessage()
const { getImages } = usePreferencesService()
const imageRegister = getImages().image_url_register_lg
const loading = ref(false);

const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(
        z.object({
            email: z
                .string({
                    required_error: "Email is required",
                })
                .email("Email must be a valid email"),
            password: z
                .string({
                    required_error: 'Password is required',
                })
                .min(8, 'Password at least 8 characters')
                .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter (a-z)" })
                .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter (A-Z)" })
                .regex(/[0-9]/, { message: "Password must contain at least one digit (0-9)" }),
            // .regex(/[!@#$%^&*()?]/i, { message: "Password must contain at least one special character from @$!%*?&" }),
            confirm_password: z
                .string({
                    required_error: "required"
                })
        })
            .refine(data => data.password === data.confirm_password, {
                message: "Password and confirmation password do not match"
            })
    ),
});

const onSubmit = handleSubmit(async (values) => {
    if (!loading.value) {
        loading.value = true
        await register(values.email, values.password)
            .then(async (succes) => {
                if (succes) {
                    await login(values.email, values.password)
                }
            })
            .catch((error) => {
                showMessage(error, TypeMessage.destructive)
            })
            .finally(() => {
                loading.value = false
            })
    }
});

</script>