import axios from "axios"

export interface PropsCallback {
    callback?: () => void
}

export interface WithAPIRequestFuncType {
    apiRequestFunc: (data: any) => Promise<axios.AxiosResponse<any>>
}