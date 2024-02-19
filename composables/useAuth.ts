import type { BaseResponse, BaseLoginData, RefreshTokenData } from "~/types";
import type { User } from "~/types/user";

export default () => {
    const config_public = useRuntimeConfig().public
    const base_url = config_public.base_api_url + config_public.api_version
    const KEY_REFRESH_TOKEN = 'refresh_token'
    const { getDeviceId } = useDevice();
    const { getPreferences } = usePreferencesService();

    const useAuthRefreshToken = () => localStorage.getItem(KEY_REFRESH_TOKEN)
    const useAuthToken = () => useState('auth_token')
    const useAuthUser = () => useState('auth_user')
    const useAuthLoading = () => useState('auth_loading', (() => true))

    const setRefreshToken = (newToken: string) => {
        localStorage.setItem(KEY_REFRESH_TOKEN, newToken)
    }

    const setToken = (newToken: string) => {
        const authToken = useAuthToken()
        authToken.value = newToken
    }

    const setUser = (newUser: User) => {
        const authUser = useAuthUser()
        authUser.value = newUser
    }

    const setIsAuthLoading = (value: boolean) => {
        const authLoading = useAuthLoading()
        authLoading.value = value
    }

    const login = (email: string, password: string) => {
        return new Promise(async (resolve, reject) => {
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
                        },
                        credentials: 'include'
                    }
                );
                if (response.success) {
                    const data = response.data as BaseLoginData
                    setRefreshToken(data.refresh_token)
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

    const loginAsAnonymous = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const deviceId = getDeviceId();
                const response = await $fetch<BaseResponse>(
                    `${base_url}/login/anon/`,
                    {
                        method: 'POST',
                        body: {
                            'device_id': deviceId
                        },
                        credentials: 'include'
                    }
                );
                if (response.success) {
                    const data = response.data as BaseLoginData
                    setRefreshToken(data.refresh_token)
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

    const register = (email: string, password: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const deviceId = getDeviceId();
                const response = await $fetch<BaseResponse>(
                    `${base_url}/register/user/`,
                    {
                        method: 'POST',
                        body: {
                            'email': email,
                            'password': password,
                            'device_id': deviceId
                        },
                        credentials: 'include'
                    }
                );
                if (response.success) {
                    resolve(true)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    const getUser = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/user/me/`,
                    { method: 'GET', credentials: 'include' }
                );
                if (response.success) {
                    const user = response.data as User
                    setUser(user)
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
        return new Promise(async (resolve, reject) => {
            try {
                const refresh_token = useAuthRefreshToken() ?? ""
                const response = await $fetch<BaseResponse>(
                    `${base_url}/auth/refresh/`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            Authorization: refresh_token
                        }
                    }
                );
                if (response.success) {
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
        return new Promise(async (resolve, reject) => {
            setIsAuthLoading(true)
            try {
                await refreshToken()
                await getUser()
                await getPreferences()
                resolve(true)
            } catch (error) {
                console.log(error)
                reject(error)
            } finally {
                setIsAuthLoading(false)
            }
        })
    };

    return {
        useAuthLoading,
        login,
        loginAsAnonymous,
        register,
        useAuthUser,
        useAuthToken,
        initAuth
    }
}