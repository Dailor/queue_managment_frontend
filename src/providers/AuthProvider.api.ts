import {axiosProtected} from "@/axioses/protected"
import {AuthEndpointAPI} from "@/apiEndpoints"

export const loadUserMeRequestApi = () => {
    return axiosProtected.get(AuthEndpointAPI.me)
}