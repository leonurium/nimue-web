import type { User } from "~/types/user";

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;

    const getUserById = async (user_id: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/user/${user_id}`,
                    { method: 'GET' }
                );
                if (response.success) {
                    const data = response.data as User
                    resolve(data)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        getUserById
    }
}