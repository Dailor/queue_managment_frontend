import Head from "next/head"
import React, {useCallback, useEffect, useRef, useState} from "react"
import TerminalSocketService from "@/services/terminalSocket"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt"
import {Box, CircularProgress, Grid, Typography} from "@mui/material"

import {QRCodeSVG} from 'qrcode.react'

const getLinkWithTicketHash = (token: string) => {
    return location.origin + '/scanner/' + token
}

export default function TerminalPage() {
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
                <title>Терминал</title>
            </Head>
            <Grid container sx={{
                justifyContent: 'center',
                paddingTop: 8,
            }}>
                <Grid item xs={12} sx={{marginBottom: 2, textAlign: 'center'}}>
                    <Typography variant={'h3'} sx={{marginBottom: 4, fontWeight: '600'}}>
                        Онлайн очередь
                    </Typography>

                    {(isSocketClosed) && (
                        <Typography color={'red'} sx={{fontWeight: '600', marginTop: -2}}>
                            Подключение закрыто, обновите страницу!
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={8} sm={5} md={3} lg={2}>
                    <Box sx={{paddingX: 3, marginBottom: 6}}>
                        {(!isReady) && (
                            <CircularProgress size={'100%'} sx={{padding: 5}} thickness={2.5} color="primary"/>
                        )}
                        {(isReady && !!token) && (
                            <QRCodeSVG style={{width: '100%', height: '100%'}} value={getLinkWithTicketHash(token)}/>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{textAlign: 'center'}}>
                    <Typography variant={'h4'} sx={{color: 'primary.main'}}>Отсканируй Меня!</Typography>
                    <Typography variant={'h4'} sx={{color: 'warning.main'}}>Мені Сканерлеңіз!</Typography>
                    <Typography variant={'h4'} sx={{color: 'info.main'}}>Scan Me!</Typography>
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