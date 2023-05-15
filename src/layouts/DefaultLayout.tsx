import React, {useCallback, useEffect, useState} from 'react'
import {AppProps} from "next/app"
import {useRouter} from "next/router"
import {useAuth} from "@/providers/AuthProvider"
import {Box, CircularProgress, Toolbar} from "@mui/material"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";


const DefaultLayout = ({Component, pageProps}: AppProps) => {
    const router = useRouter()
    const component = <Component {...pageProps} />

    const {isAuthFetching, isAuth, isAdmin, isDashboard, isOperator, redirectToLogin} = useAuth()

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

                if (router.pathname.startsWith("/admin") && !isAdmin) {
                    isAllowed = false
                } else if (router.pathname.startsWith("/director") && !isDashboard) {
                    isAllowed = false
                } else if (router.pathname.startsWith("/operator") && !isOperator) {
                    isAllowed = false
                }
                if (router.pathname.startsWith('/login') || !isAllowed) {
                    void router.push('/')
                }
            } else {
                if (!router.pathname.startsWith('/login'))
                    void redirectToLogin()
            }
            toggleOffLoader()
        }
    }, [isAuth, isAuthFetching, isAdmin, isDashboard, isOperator, router, redirectToLogin])

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