import type { CommentsData } from "~/types/comment";
import type { User } from "~/types/user";

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;

    const getCommentByTimelineId = async (timeline_id: number, page: number, itemPerPage: number) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/comment/${timeline_id}/${page}/${itemPerPage}`,
                    { method: 'GET' }
                );
                if (response.success) {
                    const data = response.data as CommentsData
                    resolve(data)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    const addNewReply = async (user: User, timeline_id: number, text_content: string) => {
        return new Promise(async (resolve, reject) => {
            const params_body = {
                'user_id': user.user_id,
                'timeline_id': timeline_id,
                'name': user.name,
                'text_content': text_content,
                'comment_id': 0,
                'timed': useNow().value.toString()
            }

            try {
                const response = await useFetchApi(
                    `${base_url}/comment/new/`,
                    {
                        method: 'POST',
                        body: params_body
                    }
                );
                if (response.success) {
                    resolve(params_body)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        getCommentByTimelineId,
        addNewReply
    }
}