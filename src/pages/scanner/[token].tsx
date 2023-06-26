import Head from "next/head"
import React, {useEffect, useState} from "react"
import Router, {useRouter} from "next/router"
import {scanRequest} from "@/requests/ticket"
import {getLocalUniqueID, setLocalUniqueID} from "@/utilities/uniqueDevice"
import {Box, CircularProgress, Grid, Typography} from "@mui/material"

export default function Scanner() {
    const router = useRouter()

    const [isLoading, toggleIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        const token = router.query.token as string
        const uniqueId = getLocalUniqueID()


        scanRequest({token, uniqueId})
            .then(r => {
                void Router.push('/book/' + token)
            })
            .catch(e => {
                if (e.response?.status == 400) {
                    setError(e.response.data.error)
                } else {
                    setError('Ошибка')
                }
            })
            .finally(() => {
                toggleIsLoading(false)
            })
    }, [router.query.token])

    return (
        <>
            <Head>
                <title>Сканнирование</title>
            </Head>
            <Grid container sx={{
                justifyContent: 'center',
                paddingTop: 8,
            }}>
                <Grid item xs={12} sx={{marginBottom: 2}}>
                    <Typography variant={'h3'} sx={{marginBottom: 4, textAlign: 'center', fontWeight: '600'}}>Онлайн
                        очередь</Typography>
                </Grid>
                <Grid item xs={8} sm={5} md={3} lg={2}>
                    {(isLoading) && (
                        <Box sx={{paddingX: 3, marginBottom: 6}}>
                            <CircularProgress size={'100%'} sx={{padding: 5}} thickness={2.5} color="primary"/>
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12} sx={{textAlign: 'center'}}>
                    {(isLoading) && (
                        <Typography variant={'h4'} sx={{color: 'primary.main'}}>Пожалуйста подождите!</Typography>
                    )}
                    {(!isLoading && error) && (
                        <Typography color='primary' variant={'h5'}>{error}. Попробуйте снова отсканировать
                            QR</Typography>
                    )}
                </Grid>
            </Grid>
        </>
    )
}