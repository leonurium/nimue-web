import type { BaseLoginData, BaseResponse, RefreshTokenData, User } from "~/types/timeline"

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;
    const { getDeviceId } = useDevice();

    const useAuthToken = () => useState('auth_token')
    const useAuthUser = () => useState('auth_user')

    const setToken = (newToken: string) => {
        const authToken = useAuthToken()
        authToken.value = newToken
    }

    const setUser = (newUser: User) => {
        const authUser = useAuthUser()
        authUser.value = newUser
    }

    const login = (email: string, password: string) => {
        return new Promise(async(resolve, reject) => {
            try {
                const deviceId = getDeviceId();
                const response = await $fetch<BaseResponse>(
                    `${base_url}/login/user/`,
                    {
                        method: 'POST',
                        body: {
                            'device_id': deviceId,
                            'email': email,
                            'password': password
                        }
                    }
                );
                if(response.success) {
                    const data = response.data as BaseLoginData
                    setToken(data.access_token)
                    setUser(data.user)
                    resolve(true)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    };

    const refreshToken = () => {
        return new Promise(async(resolve, reject) => {
            try {
                const deviceId = getDeviceId();
                const response = await $fetch<BaseResponse>(
                    `${base_url}/auth/refresh/`,
                    { method: 'GET' }
                );
                if(response.success) {
                    const data = response.data as RefreshTokenData
                    setToken(data.access_token)
                    resolve(true)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    };

    const initAuth = () => {
        return new Promise(async(resolve, reject) => {
            try {
                await refreshToken()
                resolve(true)
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    };

    return {
        login,
        useAuthUser,
        initAuth
    }
}