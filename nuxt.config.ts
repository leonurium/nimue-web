// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "nuxt-icon",
        "nuxt-lucide-icons",
        "@vee-validate/nuxt"
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

    runtimeConfig: {
        public: {
            app_name: "Netijen Curhat",
            base_api_url: process.env.BASE_URL_API,
            base_socket_url: process.env.BASE_URL_SOCKET
        },
    },

    app: {
        head: {
            title: "Netijen Curhat",
            titleTemplate: "%s - Netijen Curhat"
        }
    }
});