import React, {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {UserRolesEnum} from "@/constants"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage, ISetAuth, removeJwtTokens, setJwtTokens} from "@/utilities/jwt"
import Router, {useRouter} from "next/router"

interface IAuthState {
    user: LocalUser | null
    isAuthFetching: boolean
    isAuth: boolean
}

export interface LocalUser {
    id: number

    fullName: string
    role: number
    operator?: {
        windowNumber: number
    }
}

interface AuthContextType extends IAuthState {
    isAdmin: boolean
    isDashboard: boolean
    isOperator: boolean
    isTerminal: boolean
    setAuth: ISetAuth
    redirectToLogin: { (): Promise<any> }
    logout: Function,
}

interface Props {
    children: React.ReactNode
}

export const AuthProvider = ({children}: Props) => {
    const router = useRouter()

    const [isAuthFetching, toggleIsAuthFetching] = useState<boolean>(true)
    const [user, setUser] = useState<LocalUser | null>(null)

    const isAdmin = user?.role === UserRolesEnum.ADMIN
    const isDashboard = user?.role === UserRolesEnum.DASHBOARD
    const isOperator = user?.role === UserRolesEnum.OPERATOR
    const isTerminal = user?.role === UserRolesEnum.TERMINAL

    const redirectToLogin = useCallback(() => {
        return router.push('/login')
    }, [router])

    const loadUser = useCallback(() => {
        const accessToken = getAccessTokenFromLocalStorage()

        if (accessToken) {
            return loadUserMeRequestApi()
                .then(r => {
                    setUser(r.data)
                })
                .catch(e => {

                })
                .finally(() => {
                    toggleIsAuthFetching(false)
                })
        } else {
            toggleIsAuthFetching(false)

            return new Promise(() => {
            })
        }
    }, [])

    const setAuth: ISetAuth = (accessToken, refreshToken) => {
        setJwtTokens({accessToken, refreshToken})
        return loadUser()
    }

    const logout = useCallback(() => {
        removeJwtTokens()
        setUser(null)
        void Router.push('/login')
    }, [])

    useEffect(() => {
        loadUser()
    }, [loadUser])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuth: !!user,
                isAdmin,
                isDashboard,
                isOperator,
                isTerminal,
                isAuthFetching,
                setAuth,
                redirectToLogin,
                logout
            }}>{children}</AuthContext.Provider>
    )
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    return useContext(AuthContext) as AuthContextType
}
