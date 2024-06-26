export default () => {
    const config_public = useRuntimeConfig().public
    const base_url = config_public.base_api_url + config_public.api_version

    const report = async (
        report_by: string,
        user_id: string,
        reason: string,
        proof_id: string,
        proof: string
    ) => {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await useFetchApi(
                    `${base_url}/timeline/report/`,
                    {
                        method: 'POST',
                        body: {
                            'report_by': report_by,
                            'user_id': user_id,
                            'reason': reason,
                            'proof_id': proof_id,
                            'proof': proof
                        }
                    }
                );
                if(response.success) {
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
        report
    }

}