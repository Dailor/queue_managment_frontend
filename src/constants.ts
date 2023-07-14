export const getHost = () => {
    if (process.env.DEBUG) {
        return 'localhost:8000'
    } else {
        return 'queue.iitu.edu.kz'
    }
}

const TTS_API_STATIC_ENDPOINT = 'http://proct.iitu.edu.kz/tts/static/queue'

export const get_tts_api_static = (filename: string) => {
    return TTS_API_STATIC_ENDPOINT + '/' + filename
}

export const BACKEND_URL = process.env.DEBUG ? `http://${getHost()}` : `https://${getHost()}`

export const ACCEPT_TOKEN_KEY = 'access-token'
export const REFRESH_TOKEN_KEY = 'refresh-token'

export enum UserRolesEnum {
    ADMIN,
    OPERATOR,
    DASHBOARD,
    TERMINAL
}

type RoleToRoleName = {
    [key: string]: string
}
export const roleToRoleName: RoleToRoleName = {
    [UserRolesEnum.ADMIN]: 'Админ',
    [UserRolesEnum.DASHBOARD]: 'Dashboard',
    [UserRolesEnum.OPERATOR]: 'Оператор'
}

export const rolesToEnum = Object.keys(roleToRoleName).map((k) => [k, roleToRoleName[k]])