import axios from "axios"
import {TicketEndpointsAPI} from "@/apiEndpoints"

interface IScanRequest {
    ticketHash: string
    uniqueId: string
}

export const scanRequest = (data: IScanRequest) => {
    return axios.post(TicketEndpointsAPI.scan, data)
}