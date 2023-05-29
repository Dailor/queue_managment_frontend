import React, {useCallback, useEffect, useState} from 'react'
import {AppProps} from "next/app"
import {NextRouter, useRouter} from "next/router"
import {useAuth} from "@/providers/AuthProvider"
import {Box, CircularProgress, Toolbar} from "@mui/material"
import Navigation from "@/components/navigation/Navigation"

const checkRouteAndAccess = (router: NextRouter, routerPath: string, access: boolean) => {
    return router.pathname.startsWith(routerPath) && !access
}
const DefaultLayout = ({Component, pageProps}: AppProps) => {
    const router = useRouter()
    const component = <Component {...pageProps} />

    const {isAuthFetching, isAuth, isAdmin, isDashboard, isTerminal, isOperator} = useAuth()

    const [isShowLoader, toggleIsShowLoader] = useState(true)

    const toggleOffLoader = () => {
        setTimeout(() => {
            toggleIsShowLoader(false)
        }, 2000)
    }

    useEffect(() => {
        if (!isAuthFetching) {
            if (isAuth) {
                let isAllowed = true

                if (checkRouteAndAccess(router, '/admin', isAdmin)) {
                    isAllowed = false
                } else if (checkRouteAndAccess(router, "/terminal", isTerminal)) {
                    isAllowed = false
                } else if (checkRouteAndAccess(router, "/operator", isOperator)) {
                    isAllowed = false
                } else if (checkRouteAndAccess(router, "/dashboard", isOperator)) {
                    isAllowed = false
                }
                if (router.pathname.startsWith('/login') || !isAllowed) {
                    void router.push('/')
                }
            } else {
                if (!router.pathname.startsWith('/') &&
                    !router.pathname.startsWith('/login') &&
                    !router.pathname.startsWith('/scanner/') &&
                    !router.pathname.startsWith('/ticket/')
                )
                    void router.push('/')
            }
            toggleOffLoader()
        }
    }, [isAuth, isAuthFetching, isAdmin, isDashboard, isOperator, router])

    if (isShowLoader) {
        return (
            <Box sx={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress size={75}/>
            </Box>
        )
    }

    if (router.pathname == '/login') {
        return component
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'start', height: '100vh'}}>
            <Navigation/>
            <Box
                component="main"
                sx={{flexGrow: 1, px: 3,}}
            >
                <Toolbar/>
                {component}
            </Box>
        </Box>
    )
}

export default DefaultLayout