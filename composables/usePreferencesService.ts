import type { Preferences } from "~/types/preferences";

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;
    const useAppPreferences = () => useState('app_preferences')

    const setPreferences = (value: Preferences) => {
        const preferences = useAppPreferences()
        preferences.value = value
    }

    const getPreferences = async () => {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/preferences/`,
                    { method: 'GET' }
                );
                if(response.success) {
                    const data = response.data as Preferences
                    setPreferences(data)
                    resolve(data)
                } else {
                    reject(response.message)
                }
            } catch (error) {
                reject(error)
            }
        })
    };

    function getAppName(): string {
        const preferences = useAppPreferences().value as Preferences
        return preferences.app_name
    }

    function getReplyEmojis(): string[] {
        const preferences = useAppPreferences().value as Preferences
        return preferences.reply_emojis
    }

    function getReportReasons(): [string] {
        const preferences = useAppPreferences().value as Preferences
        return preferences.report_reasons
    }

    return {
        getPreferences,
        getAppName,
        getReplyEmojis,
        getReportReasons
    }
}