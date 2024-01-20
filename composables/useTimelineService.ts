import type { TimelinesData } from "~/types/timeline";

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;

    const getTimelines = async (device_id: string, page: string, itemPerPage: string) => {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/${device_id}/${page}/${itemPerPage}`,
                    { method: 'GET' }
                );
                if(response.success) {
                    const data = response.data as TimelinesData
                    resolve(data)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    };

    return {
        getTimelines
    }
}