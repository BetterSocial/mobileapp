import api from './config'

const isDemoLoginViewEnabled = async () => {
    try {
        const response = await api.get('/config/is-demo-login-enabled')
        return response?.data?.success
    } catch(e) {
        return false
    }
}

const getRemoteConfig = {
    isDemoLoginViewEnabled
}

export default getRemoteConfig