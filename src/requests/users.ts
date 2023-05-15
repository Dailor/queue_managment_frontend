import {axiosProtected} from "@/axioses/protected"
import {UsersEndpointsAPI} from "@/apiEndpoints"
import {IUser} from "@/types/user"
import {UserRolesEnum} from "@/constants";

interface IUserRequest extends Omit<IUser, 'department'> {
}

interface IDepartmentsResponse {
    users: IUserRequest[]
}

interface IUserEditRequest{
    role: UserRolesEnum
    departmentID: number
}

const usersAPI = {
    list: () => axiosProtected.get<IDepartmentsResponse>(UsersEndpointsAPI.list),
    edit: (id: number, data: IUserEditRequest) => axiosProtected.post(UsersEndpointsAPI.edit(id), data)
}

export default usersAPI