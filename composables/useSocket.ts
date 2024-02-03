import io, { Socket } from "socket.io-client";
import type { User } from "~/types/user";

// const socket = ref<Socket>();
export default () => {
    const stateSocket = () => useState('state_socket')

    const socket = () => {
        if (stateSocket().value) {
            const sock = stateSocket().value as Socket
            return sock
        } else {
            const baseURL = useRuntimeConfig().public.base_socket_url
            const sock = io(`${baseURL}`, {
                // withCredentials: true,
                autoConnect: false
            })
            sock.disconnect();
            stateSocket().value = sock
            console.log(`socket init to ${baseURL}`)

            sock.onAny((event, ...args) => {
                console.log(event, args);
            });
            return sock
        }
    }

    const authSocket = () => {
        const { useAuthUser } = useAuth()
        const user = useAuthUser().value as User
        const session_id = localStorage.getItem("chat_session_id");

        if (user && session_id) {
            if (socket() && !socket().connected) {
                // socket sending auth user_id and session_id
                socket().auth = { user_id: user.user_id, session_id: session_id }
                socket().connect()
            }
        } else if (user && !session_id) {
            if (socket() && !socket().connected) {
                // socket sending auth user_id
                socket().auth = { user_id: user.user_id }
                socket().connect()

                // socket listen emit session
                socket().on("session", ({ session_id }) => {
                    // attach the session ID to the next reconnection attempts
                    if (socket()) {
                        // socket sending auth user_id and session session_id
                        socket().auth = { user_id: user.user_id, session_id: session_id }
                        // store it in the localStorage
                        localStorage.setItem("chat_session_id", session_id);
                    }
                });
            }
        } else {
            socket().disconnect();
        }
    }

    return {
        socket,
        authSocket
    }
}