import axios from "axios"
import {QueueEndpointAPI} from "@/apiEndpoints"

interface QueueListResponse {
    queues: Queue[]
}

export const queueListRequest = () => {
    return axios.get<QueueListResponse>(QueueEndpointAPI.list)
}