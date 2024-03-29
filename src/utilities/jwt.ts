import {getUnixTime} from "./date"
import {ACCEPT_TOKEN_KEY, REFRESH_TOKEN_KEY} from "@/constants"

const LIFE_TIME_TO_UPDATE_MULTIPLIER = 0.5

export interface IAuthTokenInfo {
    exp: number
    iat: number
    login: string
}

type Tokens = { accessToken: string, refreshToken: string }

export interface ISetAuth {
    (accessToken: string, refreshToken: string): Promise<any>
}

export const setJwtTokens: (tokens: Tokens) => void = ({accessToken, refreshToken}) => {
    void localStorage.setItem(ACCEPT_TOKEN_KEY, accessToken)
    void localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const getAccessTokenFromLocalStorage = () => {
    return localStorage.getItem(ACCEPT_TOKEN_KEY)
}

export const getRefreshTokenFromLocalStorage = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const removeJwtTokens = () => {
    void localStorage.removeItem(ACCEPT_TOKEN_KEY)
    void localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const isTokenExpired = (token: string | null): boolean => {
    if (!token) {
        return true
    }

    try {
        const tokenInfo = token.split('.')[1]
        const tokenInfoDecoded = window.atob(tokenInfo)
        const {exp, iat}: IAuthTokenInfo = JSON.parse(tokenInfoDecoded)

        const tokenLeftTime = exp - getUnixTime()

        const minLifeTimeForUpdate = (exp - iat) * LIFE_TIME_TO_UPDATE_MULTIPLIER

        return tokenLeftTime < minLifeTimeForUpdate
    } catch (e) {
        console.error(e)
        return true
    }
}
