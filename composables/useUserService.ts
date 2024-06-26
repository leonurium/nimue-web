import type { User } from "~/types/User";

export default () => {
    const config_public = useRuntimeConfig().public
    const base_url = config_public.base_api_url + config_public.api_version

    // const getUserById = async (user_id: string) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const response = await useFetchApi(
    //                 `${base_url}/user/${user_id}`,
    //                 { method: 'GET' }
    //             );
    //             if (response.success) {
    //                 const data = response.data as User
    //                 resolve(data)
    //             } else {
    //                 reject(response.message)
    //             }
    //         } catch (error) {
    //             reject(error)
    //         }
    //     })
    // }

    const getMultipleUsers = async (user_ids: string[]) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/user/multiple/`,
                    {
                        method: 'POST',
                        body: {
                            'user_ids': user_ids
                        }
                    }
                );
                if (response.success) {
                    const data = response.data as User[]
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
        // getUserById,
        getMultipleUsers
    }
}