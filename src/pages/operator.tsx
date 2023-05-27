import React, {useCallback, useEffect, useRef, useState} from "react"
import Head from "next/head"
import {Box, Button, Container, Grid, Typography} from "@mui/material"
import CoolDownButton from "@/components/CoolDownButton"
import OperatorSocketService from "@/services/operatorSocket"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt"

export default function OperatorPage() {
    const [countInQueue, setCountInQueue] = useState<number>()
    const [currentNumber, setCurrentNumber] = useState<number>()

    const operatorSocketRef = useRef<OperatorSocketService>()
    const [isSocketClosed, toggleIsSocketClosed] = useState()


    useEffect(() => {
        let responseStatusOK = true

        try {
            void loadUserMeRequestApi()

        } catch (e) {
            responseStatusOK = false
        }

        if (responseStatusOK) {
            operatorSocketRef.current = new OperatorSocketService({
                setCountInQueue,
                setCurrentNumber,
                toggleIsSocketClosed
            })
            operatorSocketRef.current?.init(getAccessTokenFromLocalStorage())
        }
    }, [])

    const callNext = useCallback(() => {
        operatorSocketRef.current?.callNext()
    }, [operatorSocketRef])

    return (
        <>
            <Head>
                <title>Вход</title>
            </Head>
            <Container sx={{paddingTop: 3}}>
                <Box sx={{marginBottom: 2}}>
                    <Typography variant='h4' fontWeight='bold'>Оператор</Typography>
                </Box>
                <Box sx={{marginBottom: 3}}>
                    <CoolDownButton variant='contained' coolDownSeconds={20} onClick={callNext} sx={{px: 4}}>Позвать
                        Следующиего</CoolDownButton>
                </Box>
                <Box sx={{marginBottom: 2}}>
                    <Typography variant='h4'>В очереди: {countInQueue}</Typography>
                </Box>
                <Box>
                    <Typography variant='h5'>Сейчас вы обслуживаете номер:
                        <Typography color='info' variant={'span'}> {currentNumber}</Typography></Typography>
                </Box>
            </Container>
        </>
    )
}