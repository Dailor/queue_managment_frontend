export const BACKEND_URL = process.env.DEBUG ? 'http://localhost:8000' : 'http://queue.iitu.edu.kz'

export const ACCEPT_TOKEN_KEY = 'access-token'
export const REFRESH_TOKEN_KEY = 'refresh-token'

export enum UserRolesEnum {
    ADMIN,
    OPERATOR,
    DASHBOARD,
    TERMINAL
}

export const roleToRoleName = {
    [UserRolesEnum.ADMIN]: 'Админ',
    [UserRolesEnum.DASHBOARD]: 'Dashboard',
    [UserRolesEnum.OPERATOR]: 'Оператор'
}

export const rolesToEnum = Object.keys(roleToRoleName).map((k) => [k, roleToRoleName[k as unknown as UserRolesEnum]])

export const getHost = () => {
    if (process.env.DEBUG) {
        return 'localhost:8000'
    } else {
        return location.host
    }
}