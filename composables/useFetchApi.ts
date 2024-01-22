import type { BaseResponse } from "~/types";

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