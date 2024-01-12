// export const useUseTimelines = () => {
//   return ref()
// }

export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;
    const page = ref(1);
    const itemPerPage = 10;
    const getTimelines = () => {
        return new Promise( async (resolve, reject) => {
            try {
                const response = await $fetch(
                    `${base_url}/timeline/B6961C40-5D18-48FE-B06C-1314B34162CC/${page.value}/${itemPerPage}`,
                    {
                        method: 'GET',
                        mode: 'no-cors'
                    }
                )
                console.log(response)
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }
    return {
        getTimelines
    }
}