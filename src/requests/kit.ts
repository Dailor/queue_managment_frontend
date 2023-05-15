import {axiosProtected} from "@/axioses/protected"
import {KitsEndpointsAPI, UsersEndpointsAPI} from "@/apiEndpoints"
import {IKit} from "@/types/kit"
import {IItem} from "@/types/item"

export interface IKitResponse {
    kits: IKit[]
    items: IItem[]
}

interface IKitRequest extends Omit<IKit, 'id'> {
}


const kitsAPI = {
    list: () => axiosProtected.get<IKitResponse>(KitsEndpointsAPI.list),
    add: (data: IKitRequest) => axiosProtected.put(KitsEndpointsAPI.list, data),
    edit: (id: Pick<IKit, 'id'>, data) => axiosProtected.post(UsersEndpointsAPI.edit(id), data)
}

export default kitsAPI