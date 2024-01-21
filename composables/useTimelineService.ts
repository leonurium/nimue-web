import type { TimelinesData } from "~/types/timeline";

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;

    const getTimelines = async (user_id: number, page: string, itemPerPage: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/${user_id}/${page}/${itemPerPage}`,
                    { method: 'GET' }
                );
                if (response.success) {
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

    const doLikeTimeline = async (user_id: number, timeline_id: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/like/`,
                    {
                        method: 'POST',
                        body: {
                            'user_id': user_id,
                            'timeline_id': timeline_id
                        }
                    }
                );
                if (response.success) {
                    resolve(true)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    const doUnlikeTimeline = async (user_id: number, timeline_id: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/unlike/`,
                    {
                        method: 'POST',
                        body: {
                            'user_id': user_id,
                            'timeline_id': timeline_id
                        }
                    }
                );
                if (response.success) {
                    resolve(true)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    const doShareTimeline = async (user_id: number, timeline_id: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/share/`,
                    {
                        method: 'POST',
                        body: {
                            'user_id': user_id,
                            'timeline_id': timeline_id
                        }
                    }
                );
                if (response.success) {
                    resolve(true)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        getTimelines,
        doLikeTimeline,
        doUnlikeTimeline,
        doShareTimeline
    }
}