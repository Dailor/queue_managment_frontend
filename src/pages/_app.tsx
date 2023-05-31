import React, {useEffect} from 'react'


import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'

import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {AuthProvider} from "@/providers/AuthProvider"
import {CssBaseline} from "@mui/material"
import {theme} from "@/theme"
import axios from "axios"
import DefaultLayout from "@/layouts/DefaultLayout"
import Head from 'next/head'
import LocalThemeProvider from "@/providers/LocalThemeProvider"

axios.defaults.baseURL = 'http://localhost:8000'

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <title>IITU |</title>
            </Head>
            <AuthProvider>
                <LocalThemeProvider>
                    <CssBaseline/>
                    <DefaultLayout {...{Component, pageProps}}/>
                </LocalThemeProvider>
            </AuthProvider>
        </>
    )
}
