import io, { Socket } from "socket.io-client";

const socket = ref<Socket>();
export default () => {
    if (socket.value) return socket;
    if (process.client) {
        const baseURL = useRuntimeConfig().public.base_socket_url
        socket.value = io(`${baseURL}`, {
            // withCredentials: true,
            autoConnect: false
        });
        socket.value.disconnect();
        console.log(`socket init to ${baseURL}`)
    }

    socket.value?.onAny((event, ...args) => {
        console.log(event, args);
    });
    return socket;
}