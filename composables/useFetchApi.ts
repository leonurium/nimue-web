import type { BaseResponse } from "~/types";

export default (url: string, options?: object, headers?: object) => {
    const { useAuthToken, refreshToken } = useAuth()

    return $fetch<BaseResponse>(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: `Bearer ${useAuthToken().value}`
        },
        retry: 1,
        retryStatusCodes: [401],
        retryDelay: 500,
        async onResponseError(context) {
            if (context.response.status === 401) {
                await refreshToken()
            }
        },
    });
}