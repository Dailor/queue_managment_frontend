import React, {useEffect, useState} from 'react'
import {AppProps} from "next/app"
import {NextRouter, useRouter} from "next/router"
import {useAuth} from "@/providers/AuthProvider"
import {Box, CircularProgress, Toolbar} from "@mui/material"
import Navigation from "@/components/navigation/Navigation"

const checkRouteAndAccess = (router: NextRouter, routerPath: string, access: boolean) => {
    return router.pathname.startsWith(routerPath) && !access
}

interface DefaultLayoutProps {
    Component: AppProps['Component']
    pageProps: AppProps['pageProps']
}

const DefaultLayout = ({Component, pageProps}: DefaultLayoutProps) => {
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

                if (checkRouteAndAccess(router, '/admin', isAdmin) ||
                    checkRouteAndAccess(router, "/terminal", isTerminal) ||
                    checkRouteAndAccess(router, "/operator", isOperator) ||
                    checkRouteAndAccess(router, "/dashboard", isDashboard)) {
                    isAllowed = false
                }

                if (router.pathname.startsWith('/login') || !isAllowed) {
                    void router.push('/')
                } else if (router.pathname == '/') {
                    if (isDashboard) {
                        void router.push('/dashboard')
                    } else if (isTerminal) {
                        void router.push('/terminal')
                    } else if (isOperator) {
                        void router.push('/operator')
                    }
                }
            } else {
                if (!(router.pathname == '/' ||
                    router.pathname.startsWith('/login') ||
                    router.pathname.startsWith('/scanner/') ||
                    router.pathname.startsWith('/ticket/'))
                )
                    void router.push('/')
            }
            toggleOffLoader()
        }
    }, [router, isAuth, isAuthFetching, isAdmin, isDashboard, isOperator, isTerminal])

    if (isShowLoader) {
        return (
            <Box sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <CircularProgress size={75}/>
            </Box>
        )
    }

    if (router.pathname == '/login') {
        return component
    }

    const bgColor = router.pathname.startsWith('/ticket') ? 'background.default' : '#F4F4F4'

    return (
        <Box sx={{
            display: 'flex', alignItems: 'start', height: '100vh',
            bgColor
        }}>
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