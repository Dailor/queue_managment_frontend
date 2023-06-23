import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import Head from "next/head"
import {Box, Button, Container, Grid, Typography} from "@mui/material"
import CoolDownButton from "@/components/CoolDownButton"
import OperatorSocketService from "@/services/operatorSocket"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt"
import {useAuth} from "@/providers/AuthProvider"


function OperatorErrorPage({errorCode, ...props}) {

    return (
        <>
            <Head>
                <title>Талон | Ошибка</title>
            </Head>
            <Grid container sx={{
                justifyContent: 'center',
                paddingTop: 8,
            }}>
                <Grid item xs={12} sx={{marginBottom: 2}}>
                    <Typography variant={'h3'} sx={{marginBottom: 4, textAlign: 'center', fontWeight: '600'}}>Онлайн
                        очередь</Typography>
                </Grid>
                <Grid item xs={12} sx={{textAlign: 'center'}}>
                    <Box sx={{mb: 3}}>
                        <Typography color='primary' variant={'h5'}>У вас нет роли
                            оператора. Обратитесь к администратору!</Typography>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default function OperatorPage() {
    const {user} = useAuth()

    const [queues, setQueues] = useState<QueueCount[]>([])
    const [currentNumber, setCurrentNumber] = useState<number>()

    const operatorSocketRef = useRef<OperatorSocketService>()
    const [isSocketClosed, toggleIsSocketClosed] = useState()


    useEffect(() => {
        loadUserMeRequestApi()
            .then(() => {
                operatorSocketRef.current = new OperatorSocketService({
                    setQueues,
                    setCurrentNumber,
                    toggleIsSocketClosed
                })
                operatorSocketRef.current?.init(getAccessTokenFromLocalStorage() as string)
            })
    }, [])

    const callNext = useCallback(() => {
        operatorSocketRef.current?.callNext()
    }, [operatorSocketRef])


    if (!user?.operator) {
        return <OperatorErrorPage/>
    }

    return (
        <>
            <Head>
                <title>Оператор</title>
            </Head>
            <Container sx={{paddingTop: 3}}>
                <Box sx={{marginBottom: 2}}>
                    <Typography variant='h4' fontWeight='bold'>Оператор: #{user?.operator.windowNumber}</Typography>
                </Box>
                <Box sx={{marginBottom: 3}}>
                    <CoolDownButton variant='contained' coolDownSeconds={60} onClick={callNext} sx={{px: 4}}>Позвать
                        Следующиего</CoolDownButton>
                </Box>
                <Box sx={{marginBottom: 2, display: 'flex', flexWrap: 'wrap'}}>
                    <Box sx={{marginRight: 3}}>
                        <Typography variant='h4' color='warning.main'>В очереди</Typography>
                    </Box>
                    <Box>
                        {queues.map((queue) => (
                            <Box key={queue.id}>
                                <Typography variant='h4'>{queue.name}: {queue.count}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box>
                    <Typography variant='h5'>Сейчас вы обслуживаете номер:
                        <Typography color='warning.main' variant={'span'}> {currentNumber}</Typography>
                    </Typography>
                </Box>
            </Container>
        </>
    )
}