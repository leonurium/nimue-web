export default defineNuxtRouteMiddleware((to, from) => {
    // if (process.client) {
        console.log(`middleware auth called from ${from.fullPath}`)

        // const { initAuth } = useAuth()
        // initAuth()
        //     .then(() => {
        //         const { useAuthUser } = useAuth()
                
        //     })
        //     .catch(() => {
        //         const { useAuthUser } = useAuth()
                
        //     })
    // }
})