export default () => {
    const keyDeviceId = 'device_id'

    function getDeviceId(): string {
        //check device id on local storage
        const getDeviceIdFromLocalStorage = localStorage.getItem(keyDeviceId)
        if (getDeviceIdFromLocalStorage != null) {
            return getDeviceIdFromLocalStorage
        }

        //generate new device id
        const generateNewDeviceId = generateDeviceId()
        localStorage.setItem(keyDeviceId, generateNewDeviceId)
        console.log(generateDeviceId)

        return generateNewDeviceId
    }

    function generateDeviceId(): string {
        // Generate a random 32-character hexadecimal string
        const randomBytes = crypto.getRandomValues(new Uint8Array(16));
        const randomToken = Array.from(randomBytes)
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');

        return randomToken;
    }

    return {
        getDeviceId
    }
}