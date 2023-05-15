import {axiosProtected} from "@/axioses/protected"
import {DepartmentsEndpointsAPI} from "@/apiEndpoints"
import {IDepartment} from "@/types/department"

interface IDepartmentsResponse {
    departments: IDepartment[]
}

interface IDepartmentAddRequest extends Omit<IDepartment, 'id'>{}

interface IDepartmentEditRequest extends IDepartment {}


const departmentsAPI = {
    list: () => axiosProtected.get<IDepartmentsResponse>(DepartmentsEndpointsAPI.list),
    add: (data: IDepartmentAddRequest) => axiosProtected.put<IDepartmentsResponse>(DepartmentsEndpointsAPI.list, data)
}

export default departmentsAPI