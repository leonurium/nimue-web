import type { BaseResponse } from "~/types/timeline"

export default (url: string, options?: object, headers?: object) => {
    const { useAuthToken } = useAuth()

    return $fetch<BaseResponse>(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: `Bearer ${useAuthToken().value}`
        }
    });
}