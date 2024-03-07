<template>
    <div class="flex h-screen">
        <div class="relative flex-1 hidden w-0 lg:block">
            <img class="absolute inset-0 object-cover w-full h-full z-0" :src="imageLogin" />
            <div v-if="imageAppPreview" class="absolute inset-0 bg-black opacity-50 z-10"></div>

            <div v-if="imageAppPreview" class="flex flex-col items-center justify-center h-screen gap-4">
                <img :src="imageAppPreview" alt="App Preview" class="h-[calc(100svh/2)] z-20">
                <p class="text-primary-foreground z-20">Get The App</p>
                <div class="flex flex-row gap-8 text-center justify-center z-20">
                    <NuxtLink v-if="urlAppstore" :to="urlAppstore">
                        <img :src="imageAppstore"
                            alt="App Store Logo" class="h-12">
                    </NuxtLink>
                    <NuxtLink v-if="urlPlaystore" :to="urlPlaystore">
                        <img :src="imagePlaystore"
                            alt="Play Store Logo" class="h-12">
                    </NuxtLink>
                </div>
            </div>

        </div>
        <div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="flex flex-col justify-center items-center w-full h-full max-w-sm mx-auto lg:w-96">
                <UiCard class="mt-auto mx-auto max-w-sm" title="Sign In" :description="`sign in to ${getAppName()}`">
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
                                <UiButton type="submit" :disabled="loading">Sign In</UiButton>
                                <UiButton @click="loginAsAnonymousClicked" variant="secondary" :disabled="loading">
                                    <IconVenetianMask /> Sign In As Anonymous
                                </UiButton>
                            </div>

                            <p class="text-sm text-center">Don't have an account? <NuxtLink class="text-primary"
                                    to="/register" :disabled="loading">Sign Up</NuxtLink>
                            </p>
                        </UiCardContent>
                    </template>
                </UiCard>

                <div class="mt-auto text-sm text-center">
                    <p class="text-sm text-center">By clicking on the "Sign In" button, you agree to our <NuxtLink
                            class="text-primary" to="/user-agreement" :disabled="loading">User Agreement</NuxtLink> and
                        our
                        <NuxtLink class="text-primary" to="/privacy-policy" :disabled="loading">Privacy Policy
                        </NuxtLink>
                    </p>
                </div>

                <div class="mt-auto">
                    <FooterLinks />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
import { TypeMessage } from "~/types";

const { login, loginAsAnonymous } = useAuth()
const { showMessage } = useMessage()
const { getImages, getUrls, getAppName } = usePreferencesService()
const imageLogin = getImages()?.image_url_login_lg
const imageAppPreview = getImages()?.image_url_app_preview
const imageAppstore = getImages()?.image_url_app_store
const imagePlaystore = getImages()?.image_url_play_store
const urlAppstore = getUrls()?.app_store
const urlPlaystore = getUrls()?.play_store
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
    if (!loading.value) {
        loading.value = true
        await login(values.email, values.password)
            .then(() => {
                console.log("login user")
            })
            .catch((error) => {
                showMessage(error, TypeMessage.destructive)
            })
            .finally(() => {
                loading.value = false
            })
    }
});

async function loginAsAnonymousClicked() {
    if (!loading.value) {
        loading.value = true
        await loginAsAnonymous()
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                loading.value = false
            })
    }
}
</script>

<style></style>