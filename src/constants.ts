export const BACKEND_URL = 'http://localhost:8000'
export const BACKEND_API_URL = BACKEND_URL + '/api'

export const MICROSOFT_TENANT = '70c1157a-941c-4b39-98e6-a0634f2759e7'

export const ACCEPT_TOKEN_KEY = 'access-token'
export const REFRESH_TOKEN_KEY = 'refresh-token'

export enum UserRolesEnum {
    ADMIN,
    DASHBOARD = 1,
    OPERATOR = 2
}

export const roleToRoleName = {
    [UserRolesEnum.ADMIN]: 'Админ',
    [UserRolesEnum.DASHBOARD]: 'Dashboard',
    [UserRolesEnum.OPERATOR]: 'Оператор'
}

export const rolesToEnum = Object.keys(roleToRoleName).map((k) => [k, roleToRoleName[k as unknown as UserRolesEnum]])
