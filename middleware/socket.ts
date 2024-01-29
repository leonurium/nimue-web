import useSocket from "~/composables/useSocket";
import type { User } from "~/types/user";

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        console.log(`middleware socket called from ${from.fullPath}`)
        const socket = useSocket()
        const { useAuthUser } = useAuth()
        const user = useAuthUser().value as User
        const session_id = localStorage.getItem("chat_session_id");

        if (user && session_id) {
            if (socket.value && !socket.value.connected) {
                console.log(`socket sending auth ${user.user_id} and session ${session_id}`)
                socket.value.auth = { user_id: user.user_id, session_id: session_id }
                socket.value.connect()
            }
        } else if (user && !session_id) {
            if (socket.value && !socket.value.connected) {
                console.log(`socket sending auth ${user.user_id}`)
                socket.value.auth = { user_id: user.user_id }
                socket.value.connect()

                console.log("socket listen emit session")
                socket.value.on("session", ({ session_id }) => {
                    // attach the session ID to the next reconnection attempts
                    if (socket.value) {
                        console.log(`socket sending auth ${user.user_id} and session ${session_id}`)
                        socket.value.auth = { user_id: user.user_id, session_id: session_id }
                        // store it in the localStorage
                        localStorage.setItem("chat_session_id", session_id);
                    }
                });
            }
        } else {
            socket.value?.disconnect();
        }
    }
})