import type { Timeline, TimelinesData } from "~/types/timeline";

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;

    const getTimelines = async (user_id: string, page: string, itemPerPage: string) => {
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

    const getTimelineById = async (timeline_id: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/${timeline_id}`,
                    { method: 'GET' }
                );
                if (response.success) {
                    const data = response.data as Timeline
                    resolve(data)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    const newTimeline = async (user_id: string, name: string, text_content: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/new/`,
                    {
                        method: 'POST',
                        body: {
                            'user_id': user_id,
                            'name': name,
                            'text_content': text_content
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

    const deleteTimeline = async (timeline_id: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/delete/${timeline_id}`,
                    {
                        method: 'DELETE'
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

    const doLikeTimeline = async (user_id: string, timeline_id: number) => {
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

    const doUnlikeTimeline = async (user_id: string, timeline_id: number) => {
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

    const doShareTimeline = async (user_id: string, timeline_id: number) => {
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
        getTimelineById,
        newTimeline,
        deleteTimeline,
        doLikeTimeline,
        doUnlikeTimeline,
        doShareTimeline
    }
}