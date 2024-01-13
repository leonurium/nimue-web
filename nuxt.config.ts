// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "nuxt-icon",
        "nuxt-lucide-icons"
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

    lucide: {
        namePrefix: 'Icon'
    },

    runtimeConfig: {
        public: {
            // base_api_url: "https://nimueapi.ranggaleo.com"
            base_api_url: "http://localhost:8888"
        }
    },

    vite: {
        server: {
            proxy: {
                '/api': {
                    target: 'https://nimueapi.ranggaleo.com',
                    changeOrigin: true,
                },
            },
        },
    },

    app: {
        head: {
            title: "Netijen Curhat",
            titleTemplate: "%s - Netijen Curhat"
        }
    }
});