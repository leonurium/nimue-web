import { io, Socket } from "socket.io-client";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { User } from "~/types/User";

class useSocket {
    private static instance: useSocket;
    private socket: Socket | null = null;
    private socketURL: string = 'https://vast-lamb-smooth.ngrok-free.app';

    private constructor() { }

    public static getInstance(): useSocket {
        if (!useSocket.instance) {
            useSocket.instance = new useSocket();
        }
        return useSocket.instance;
    }

    public set(URL: string): void {
        this.socketURL = URL;
    }

    public establishConnection(): void {
        if (!this.socket) {
            const { useAuthUser } = useAuth()
            const user = useAuthUser().value as User

            const userStringify = JSON.stringify(user)
            const userStringb64 = btoa(userStringify)

            const config = {
                auth: {
                    user_id: user.user_id,
                    user: userStringb64, // Sending the entire user object
                }
            };

            this.socket = io(this.socketURL, {
                autoConnect: false,
                query: config.auth,
                auth: config.auth
            });
            console.log(`socket init to ${this.socketURL}`)
            this.socket.connect()
            this.addEventHandlers();
        } else {
            console.log('Socket connection already established.');
        }
    }

    public connected(): boolean {
        return this.socket?.connected ?? false
    }

    public emit(event: SocketEvent, ...args: any[]): Socket<DefaultEventsMap, DefaultEventsMap> | undefined {
        return this.socket?.emit(event, ...args)
    }

    public on(event: SocketEvent, listener: (...args: any[]) => void): Socket<DefaultEventsMap, DefaultEventsMap> | undefined {
        return this.socket?.on(event, listener)
    }

    public off(event: SocketEvent): Socket<DefaultEventsMap, DefaultEventsMap> | undefined {
        return this.socket?.off(event)
    }

    private addEventHandlers(): void {
        if (!this.socket) return;

        this.socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server.');
        });

        // Add other event handlers as needed

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server.');
        });
    }

    public closeConnection(): void {
        if (this.socket) {
            this.off('req_create_conversation')
            this.off('res_create_conversation')
            this.off('req_chats')
            this.off('res_chats')
            this.socket.offAny()
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

type SocketEvent =
    'req_create_conversation' |
    'res_create_conversation' |
    'req_conversation_by_id' |
    'res_conversation_by_id' |
    'req_conversations' |
    'res_conversations' |
    'req_chats' |
    'res_chats' |
    'req_send_chat' |
    'res_send_chat' |
    'req_typing' |
    'res_typing'

export default useSocket;