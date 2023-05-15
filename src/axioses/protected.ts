import axios, {AxiosError, CreateAxiosDefaults} from "axios"
import {BACKEND_URL} from "@/constants"
import {getAccessToken} from "@/axioses/refresh.api"
import {AuthEndpointAPI} from "@/apiEndpoints"
import {removeJwtTokens} from "@/utilities/jwt"

const forceLogout = () => {
    removeJwtTokens()
    window.location.replace('/')
}

export const axiosProtected = axios.create(
    {
        baseURL: BACKEND_URL,
    } as CreateAxiosDefaults
)

axiosProtected.interceptors.request.use(
    async (config) => {
        const accessToken = await getAccessToken()

        if (accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        }

        return config
    },
    (error) => Promise.reject(error)
)

axiosProtected.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {


        if (error.response?.status === 401) {
            const accessToken = await getAccessToken()
            const isLogIn = !!(accessToken)

            if (isLogIn && error.request.url !== AuthEndpointAPI.logout)
                forceLogout()
        }

        throw error
    }
)