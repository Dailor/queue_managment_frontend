import {axiosProtected} from "@/axioses/protected"
import {ItemEndpointsAPI} from "@/apiEndpoints"
import {IItem} from "@/types/item"

interface IItemsResponse {
    items: IItem[]
}

interface IItemAddRequest extends Omit<IItem, 'id'>{}

interface IItemEditRequest extends IItem {}


const itemsAPI = {
    list: (params) => axiosProtected.get<IItemsResponse>(ItemEndpointsAPI.list, {params}),
    add: (data: IItemAddRequest) => axiosProtected.put<IItemsResponse>(ItemEndpointsAPI.list, data)
}

export default itemsAPI