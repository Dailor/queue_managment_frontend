import axios from "axios"
import {TicketEndpointsAPI} from "@/apiEndpoints"

interface IBaseRequest {
    uniqueId: string | null
}

interface IScanRequest extends IBaseRequest {
    token: string
}

interface IBookQueueRequest extends IBaseRequest {
    queueId: number
    token: string
}

export const scanRequest = (data: IScanRequest) => {
    return axios.post(TicketEndpointsAPI.scan, data)
}

export const bookQueueRequest = (data: IBookQueueRequest) => {
    return axios.post(TicketEndpointsAPI.book, data)
}