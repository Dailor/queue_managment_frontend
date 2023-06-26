import Head from "next/head"
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {Alert, Box, Button, CircularProgress, Grid, Skeleton, Snackbar, Typography} from "@mui/material"
import ReadyIcon from "@/components/icons/ReadyIcon"
import Router, {useRouter} from "next/router"
import TicketSocketService from "@/services/ticketSocket"
import {SkeletonPlaceHolderWrapper} from "@/components/SkeletonPlaceHolderWrapper"


interface ISetIsCalled {
    windowNumber: number
}

interface ISetTicketInformation {
    ticket: TicketHumanRead
    windowNumber: number
}

interface TicketErrorPageProps {
    errorCode: number
}

function TicketErrorPage({errorCode}: TicketErrorPageProps) {
    const router = useRouter()

    const errorMsg = useMemo(() => {
        switch (errorCode) {
            case 1:
                return 'Талону не назначен номер. Нажмите на кнопку ниже'
            default:
                return 'Ошибка при загрузке талона'
        }
    }, [errorCode])

    const redirectToBook = () => {
        const token = router.query.token as string

        void Router.push('/book/' + token)
    }

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
                        <Typography color='primary' variant={'h5'}>{errorMsg}</Typography>
                    </Box>
                    {(errorCode === 1) && (
                        <Box>
                            <Button variant='contained' onClick={redirectToBook} size='large'>Обновить</Button>
                        </Box>
                    )}
                    {(errorCode === -1) && (
                        <Box style={{color: 'red'}}>
                            <div>Соединение с сервером оборвалось!</div>
                            <div>Обновите страницу!</div>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default function TicketPage() {
    const router = useRouter()
    const ticketSocketRef = useRef<TicketSocketService>()

    const [isSocketClosed, toggleIsSocketClosed] = useState<boolean>()
    const [errorCode, setErrorCode] = useState<number>()


    const [ticketFull, setTicketFull] = useState<TicketHumanRead>()
    const [windowNumber, setWindowNumber] = useState<number>(-1)
    const [inFrontCount, setInFrontCount] = useState<number | null>(null)

    const [isAlwaysConnAlertOpened, toggleIsAlwaysConnAlertOpened] = useState(true)

    const setTicketInformation = useCallback(({ticket, windowNumber}: ISetTicketInformation,) => {
        if (windowNumber !== -1) {
            setIsCalled({windowNumber})
        }
        setTicketFull(ticket)
    }, [])

    const setIsCalled = ({windowNumber}: ISetIsCalled) => {
        const audio = new Audio('/sounds/client_caller.mp3')
        audio.volume = 0.5
        audio.play()

        setWindowNumber(windowNumber)
    }

    useEffect(() => {
        const token = router.query.token as string

        ticketSocketRef.current = new TicketSocketService({
            setTicketInformation,
            setInFrontCount,
            setIsCalled,
            toggleIsSocketClosed: wrappedToggleSocketConnectionClose,
            setErrorCode
        })
        ticketSocketRef.current?.init(token)

    }, [router.query.token, setTicketInformation])

    const wrappedToggleSocketConnectionClose = (value: boolean) => {
        setErrorCode(-1)
        toggleIsSocketClosed(value)
    }

    const formattedDateTime = useMemo(() => {
        if (!ticketFull?.createdAt)
            return null

        const locale = 'kk-KZ'
        const date = new Date((ticketFull.createdAt + 6 * 60 * 60) * 1000)

        const dateOptions: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        }

        const formattedDate = date.toLocaleDateString(
            locale, dateOptions
        ).replace(
            /\//g, '.'
        )

        const formattedTime = date.toLocaleTimeString(locale, timeOptions)

        return `${formattedDate} / ${formattedTime}`
    }, [ticketFull])

    const isWindowNumberNotSet = windowNumber === -1
    const isLoaded = !!ticketFull && inFrontCount !== null

    if (errorCode !== undefined) {
        return (
            <TicketErrorPage errorCode={errorCode}/>
        )
    }

    return (
        <>
            <Head>
                <title>Талон | {ticketFull?.number}</title>
            </Head>
            <Grid container sx={{height: '100%', justifyContent: 'center', paddingTop: '5vh'}}>
                <Grid item xs={12} sm={8} md={5} lg={4}
                      sx={{
                          paddingTop: 4,
                          paddingBottom: 8,
                          borderRadius: 5,
                          bgcolor: '#FFFFFF',
                          textColor: '#3B3B3B',
                          textAlign: 'center'
                      }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 0.7
                    }}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 28,
                                    width: 120
                                }
                            }}>
                            <Typography
                                sx={{fontSize: 28, fontWeight: '800', marginRight: 1}}>Готово</Typography>
                            <ReadyIcon/>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'center', marginBottom: 3}}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 26,
                                    width: 280
                                }
                            }}>
                            <Typography sx={{fontSize: 26, fontWeight: '700'}}>{ticketFull?.queue.name}</Typography>
                        </SkeletonPlaceHolderWrapper>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'center', marginBottom: 5}}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 90,
                                    width: 150
                                }
                            }}
                        >
                            <Typography sx={{fontSize: 90, fontWeight: '700'}}>{ticketFull?.number}</Typography>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'center', marginBottom: 0.5}}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 24,
                                    width: 250
                                }
                            }}>
                            <Typography sx={{fontSize: 24, fontWeight: '700'}}>Номер вашего талона</Typography>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 6}}>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 19,
                                    width: 270
                                }
                            }}>
                            <Typography color='secondary' sx={{fontSize: 19, fontWeight: '700'}}>
                                Перед вами <Typography color='primary'
                                                       variant='span'>{Math.max(0, inFrontCount as number)}</Typography> человек
                            </Typography>
                        </SkeletonPlaceHolderWrapper>
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 17,
                                    width: 180
                                }
                            }}>
                            <Typography color='secondary' sx={{fontSize: 17, fontWeight: '700'}}>
                                {formattedDateTime}
                            </Typography>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {(isWindowNumberNotSet || !isLoaded) && (
                            <>
                                <SkeletonPlaceHolderWrapper
                                    isReady={isLoaded}
                                    skeletonProps={{
                                        variant: 'text', sx: {
                                            fontSize: 27,
                                            width: 290
                                        }
                                    }}>
                                    <Typography sx={{fontSize: 24, fontWeight: '700'}}>Не пропустите
                                        очередь</Typography>
                                </SkeletonPlaceHolderWrapper>
                                <SkeletonPlaceHolderWrapper
                                    isReady={isLoaded}
                                    skeletonProps={{
                                        variant: 'text', sx: {
                                            fontSize: 15,
                                            width: 250
                                        }
                                    }}>
                                    <Typography color='secondary' sx={{fontSize: 15, fontWeight: '700'}}>
                                        Смотрите за очередью
                                        <br/>
                                        на этой странице или на табло
                                    </Typography>
                                </SkeletonPlaceHolderWrapper>
                            </>
                        )}
                        {!isWindowNumberNotSet && isLoaded && (
                            <>
                                <Typography color='success.main' sx={{fontSize: 24, fontWeight: '700'}}>
                                    Пришла ваша очередь
                                </Typography>
                                <Typography sx={{fontSize: 20, fontWeight: '700'}}>
                                    Пройдите к окну: <Typography color='warning.main'
                                                                 variant='span'>{windowNumber}</Typography>
                                </Typography>
                            </>
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={isAlwaysConnAlertOpened && isLoaded}>
                <Alert severity="error" onClose={() => toggleIsAlwaysConnAlertOpened(false)}>
                    {!isSocketClosed && (
                        <div>
                            <div>Не нужно обновлять страницу!</div>
                            <div>Страница держит постоянное соединение с сервером!</div>
                        </div>
                    )}
                </Alert>
            </Snackbar>
        </>
    )
}