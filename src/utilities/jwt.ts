import {getUnixTime} from "./date"
import {ACCEPT_TOKEN_KEY, REFRESH_TOKEN_KEY} from "@/constants";

export interface IAuthTokenInfo {
    exp: number
    iat: number
    login: string
}

export interface ISetAuth {
    (accessToken: string, refreshToken: string): void
}

const LIFE_TIME_TO_UPDATE_MULTIPLIER = 0.5

export const setJwtTokens: ISetAuth = (accessToken, refreshToken) => {
    localStorage.setItem(ACCEPT_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const getAccessTokenFromLocalStorage = () => {
    return localStorage.getItem(ACCEPT_TOKEN_KEY)
}

export const getRefreshTokenFromLocalStorage = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const removeJwtTokens = () => {
    localStorage.removeItem(ACCEPT_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
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
