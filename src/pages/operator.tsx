import React, {useCallback, useEffect, useRef, useState} from "react"
import Head from "next/head"
import {Box, Button, Container, Grid, Typography} from "@mui/material"
import CoolDownButton from "@/components/CoolDownButton"
import OperatorSocketService from "@/services/operatorSocket"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt"
import {useAuth} from "@/providers/AuthProvider"

export default function OperatorPage() {
    const {user} = useAuth()

    const [countInQueue, setCountInQueue] = useState<number>()
    const [currentNumber, setCurrentNumber] = useState<number>()

    const operatorSocketRef = useRef<OperatorSocketService>()
    const [isSocketClosed, toggleIsSocketClosed] = useState()


    useEffect(() => {
        loadUserMeRequestApi()
            .then(() => {
                operatorSocketRef.current = new OperatorSocketService({
                    setCountInQueue,
                    setCurrentNumber,
                    toggleIsSocketClosed
                })
                operatorSocketRef.current?.init(getAccessTokenFromLocalStorage() as string)
            })
    }, [])

    const callNext = useCallback(() => {
        operatorSocketRef.current?.callNext()
    }, [operatorSocketRef])

    return (
        <>
            <Head>
                <title>Оператор | {countInQueue}</title>
            </Head>
            <Container sx={{paddingTop: 3}}>
                <Box sx={{marginBottom: 2}}>
                    <Typography variant='h4' fontWeight='bold'>Оператор: #{user?.windowNumber}</Typography>
                </Box>
                <Box sx={{marginBottom: 3}}>
                    <CoolDownButton variant='contained' coolDownSeconds={60} onClick={callNext} sx={{px: 4}}>Позвать
                        Следующиего</CoolDownButton>
                </Box>
                <Box sx={{marginBottom: 2}}>
                    <Typography variant='h4'>В очереди: {countInQueue}</Typography>
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