export default () => {
    const base_url = useRuntimeConfig().public.base_api_url;

    const report = async (
        report_by: number,
        user_id: number,
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
                            'report_by': String(report_by),
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