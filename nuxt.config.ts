// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "nuxt-icon",
        "nuxt-lucide-icons",
        "nuxt-vuefire",
        "@vee-validate/nuxt",
        "@nuxtjs/cloudinary",
        "@dargmuesli/nuxt-cookie-control",
        "@vite-pwa/nuxt"
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

    vuefire: {
        config: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOAMIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        }
    },

    pwa: {
        workbox: {
            importScripts: [
                '/firebase-messaging-sw.js'
            ]
        }
    },

    runtimeConfig: {
        public: {
            api_version: process.env.API_VERSION,
            base_api_url: process.env.BASE_URL_API,
            base_socket_url: process.env.BASE_URL_SOCKET,
            firebase_vapid_key: process.env.FIREBASE_VAPID_KEY,
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