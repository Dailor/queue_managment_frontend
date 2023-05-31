import React, {useEffect, useRef, useState} from "react"
import {Box, Container, Grid, IconButton, Typography} from "@mui/material"
import Head from "next/head"
import {useTheme} from "@/providers/LocalThemeProvider"

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import OperatorSocketService from "@/services/operatorSocket";
import DashboardSocketService from "@/services/dashboardSocket";
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api";
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt";

type DashboardRowProps = {
    isHeader?: boolean
    window: number | string
    ticket: number | string
}

const DashboardRow = ({isHeader, window, ticket}: DashboardRowProps) => {
    const typographyVariant = isHeader ? 'h2' : 'h3'
    const fontWeight = isHeader ? 'bold' : 'normal'
    const borderBottom = isHeader ? '1px solid' : undefined
    const borderRight = !isHeader ? '3px solid' : undefined

    return (
        <Box sx={{
            display: 'flex', textAlign: 'center',
            '&': {
                marginBottom: 3
            },
        }}>
            <Box sx={{flexBasis: '25%', marginRight: 6, borderRight, borderBottom}}>
                <Typography variant={typographyVariant}
                            fontWeight={fontWeight}>{window}</Typography></Box>
            <Box sx={{flexBasis: '75%', borderBottom}}>
                <Typography variant={typographyVariant}
                            fontWeight={fontWeight}>{ticket}</Typography></Box>
        </Box>
    )
}

type WindowToTicket = {
    [key: number]: number
}

export default function DashboardPage() {
    const {theme, toggleColorMode} = useTheme()

    const [windowToTicket, setWindowToTicket] = useState<WindowToTicket>({})
    const [freshWindow, setFreshWindow] = useState<number | null>(null)

    const dashboardSocketRef = useRef<DashboardSocketService>()
    const [isSocketClosed, toggleIsSocketClosed] = useState()


    useEffect(() => {
        loadUserMeRequestApi()
            .then(() => {
                dashboardSocketRef.current = new DashboardSocketService({toggleIsSocketClosed})
                dashboardSocketRef.current?.init(getAccessTokenFromLocalStorage() as string)

            })
    }, [])

    return (
        <>
            <Head>
                <title>Табло</title>
            </Head>
            <Container sx={{position: 'relative', paddingTop: 5}}>
                <Box sx={{position: 'absolute', right: 0, top: 0}}>
                    <IconButton sx={{ml: 1}} onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                    </IconButton>
                </Box>
                <Box>
                    <DashboardRow isHeader={true}
                                  window={'Окно'}
                                  ticket={'Талон'}/>
                    <DashboardRow window={5} ticket={100}/>
                    <DashboardRow window={5} ticket={100}/>
                </Box>
            </Container>
        </>
    )
}