<template>
    <div class="flex h-screen">
        <div class="relative flex-1 hidden w-0 lg:block">
            <img class="absolute inset-0 object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80" />
        </div>
        <div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="flex items-center w-full h-full max-w-sm mx-auto lg:w-96">
                <UiCard class="mx-auto max-w-sm" title="Login" description="Login dulu kali yee">
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
                            <div class="flex flex-col gap-2">
                                <UiButton type="submit">Login</UiButton>
                                <UiButton @click="loginAsAnonymousClicked" variant="secondary">
                                    <IconVenetianMask /> Login As Anonymous
                                </UiButton>
                            </div>
                        </UiCardContent>
                    </template>
                </UiCard>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { z } from "zod";

const { login, loginAsAnonymous, registerAnonymous } = useAuth()
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
                .min(8, 'Password at least 8 characters'),
        })
    ),
});

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    try {
        await login(values.email, values.password)

    } catch (error) {
        console.log(error)
    }
});

async function loginAsAnonymousClicked() {
    try {
        await loginAsAnonymous()
            .then((result) => {
                console.log("login as anonymous")
            })
            .catch( async (error) => {
                console.log(error)
                await registerAnonymous()
                    .then( async (result) => {
                        console.log("register as anonymous")

                        await loginAsAnonymous()
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .finally(() => {
                //do something
            })
    } catch (error) {
        console.log(error)
    }
}
</script>

<style></style>