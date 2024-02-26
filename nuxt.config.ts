// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "nuxt-icon",
        "nuxt-lucide-icons",
        "@vee-validate/nuxt",
        "@nuxtjs/cloudinary",
        "@dargmuesli/nuxt-cookie-control"
    ],

    tailwindcss: {
        exposeConfig: true,
    },

    colorMode: {
        classSuffix: "",
    },

    typescript: {
        shim: false,
    },

    imports: {
        imports: [
            {
                from: "tailwind-variants",
                name: "tv",
            },
            {
                from: "tailwind-variants",
                name: "VariantProps",
                type: true,
            },
        ],
    },

    vue: {
        compilerOptions: {
            isCustomElement: tag => tag === 'TransitionSlide'
        }
    },

    lucide: {
        namePrefix: 'Icon'
    },

    cookieControl: {
        isControlButtonEnabled: false
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        uploadPreset: process.env.CLOUDINARY_PRESET_UPLOAD
    },

    runtimeConfig: {
        public: {
            api_version: process.env.API_VERSION,
            base_api_url: process.env.BASE_URL_API,
            base_socket_url: process.env.BASE_URL_SOCKET,
            cloudinary: {
                uploadPreset: process.env.CLOUDINARY_PRESET_UPLOAD
            }
        },
    },

    app: {
        head: {
            title: "Netijen Curhat",
            titleTemplate: "%s - Netijen Curhat"
        }
    }
});