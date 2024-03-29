import Head from "next/head"
import React, {useCallback, useEffect, useRef, useState} from "react"
import TerminalSocketService from "@/services/terminalSocket"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt"
import {Box, CircularProgress, Grid, Typography} from "@mui/material"

import {QRCodeSVG} from 'qrcode.react'
import {useAuth} from "@/providers/AuthProvider"
import HeaderShowToggler from "@/components/HeaderShowToggler"

const getLinkWithTicketHash = (token: string) => {
    return location.origin + '/scanner/' + token
}

export default function TerminalPage() {
    const {user} = useAuth()

    const terminalSocketRef = useRef<TerminalSocketService>()
    const [isSocketClosed, toggleIsSocketClosed] = useState<boolean>()

    const [isLoading, toggleIsLoading] = useState<boolean>(true)

    const [token, setToken] = useState<string>()

    const switchOnLoader = useCallback(() => {
        toggleIsLoading(true)
    }, [])

    const setTokenWrapped = useCallback((token: string) => {
        setToken(token)
        toggleIsLoading(false)
        toggleIsSocketClosed(false)
    }, [])

    useEffect(() => {
        loadUserMeRequestApi().then(() => {
            terminalSocketRef.current = new TerminalSocketService({
                toggleIsSocketClosed,
                setToken: setTokenWrapped,
                switchOnLoader
            })
            terminalSocketRef.current?.init(getAccessTokenFromLocalStorage() as string)
        })

    }, [setTokenWrapped, switchOnLoader])

    const isReady = !(isLoading || isSocketClosed)

    return (
        <>
            <Head>
                <title>Терминал | {user?.id}</title>
            </Head>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box>
                    {isSocketClosed && (
                        <Typography color={'red'} sx={{fontWeight: '600', marginTop: -2}}>
                            Подключение закрыто, обновите страницу!
                        </Typography>
                    )}
                </Box>
                <Box>
                    <HeaderShowToggler/>
                </Box>
            </Box>
            <Grid container sx={{
                justifyContent: 'center',
                // paddingTop: 8,
            }}>
                <Grid item xs={12} sx={{marginBottom: 2, textAlign: 'center'}}>
                    {(isSocketClosed) && (
                        <Typography color={'red'} sx={{fontWeight: '600', marginTop: -2}}>
                            Подключение закрыто, обновите страницу!
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} sx={{textAlign: 'center', marginBottom: 3}}>
                    <Typography variant={'h4'} sx={{color: 'primary.main'}}>Наведи на меня камеру!</Typography>
                </Grid>
                <Grid item xs={11} sm={11} md={11} lg={6}>
                    <Box sx={{paddingX: 3, marginBottom: 6}}>
                        {(!isReady) && (
                            <CircularProgress size={'100%'} sx={{padding: 5}} thickness={2.5} color="primary"/>
                        )}
                        {(isReady && !!token) && (
                            <QRCodeSVG style={{width: '100%', height: '100%'}} value={getLinkWithTicketHash(token)}/>
                        )}
                    </Box>
                </Grid>

                {(process.env.DEBUG && !!token) && (
                    <Grid item xs={12} sx={{marginTop: 5, textAlign: 'center'}}>
                        <a href={getLinkWithTicketHash(token)} target="_blank">Ссылка</a>
                    </Grid>
                )}
            </Grid>
        </>
    )
}