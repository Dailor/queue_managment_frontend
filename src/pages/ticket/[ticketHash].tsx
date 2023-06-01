import Head from "next/head"
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {Alert, Box, Grid, Skeleton, Snackbar, Typography} from "@mui/material"
import ReadyIcon from "@/components/icons/ReadyIcon"
import {useRouter} from "next/router"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import TicketSocketService from "@/services/ticketSocket"
import {SkeletonProps} from "@mui/material/Skeleton/Skeleton"


type SkeletonPlaceHolderWrapperProps = {
    children: React.ReactNode,
    skeletonProps: SkeletonProps
    isReady: boolean
}

const SkeletonPlaceHolderWrapper = ({children, isReady, skeletonProps}: SkeletonPlaceHolderWrapperProps) => {
    if (isReady) {
        return (
            <>{children}</>
        )
    }
    return <Skeleton {...skeletonProps} />
}

interface ISetIsCalled {
    windowNumber: number
}

interface ISetTicketInformation {
    ticket: TicketHumanRead
    windowNumber: number
}

export default function TicketPage() {
    const router = useRouter()
    const ticketSocketRef = useRef<TicketSocketService>()

    const [isSocketClosed, toggleIsSocketClosed] = useState()

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
        const ticketHash = router.query.ticketHash as string

        ticketSocketRef.current = new TicketSocketService({
            setTicketInformation,
            setInFrontCount,
            setIsCalled,
            toggleIsSocketClosed
        })
        ticketSocketRef.current?.init(ticketHash)

    }, [router.query.ticketHash, setTicketInformation])

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

    return (
        <>
            <Head>
                <title>Талон | {ticketFull?.number}</title>
            </Head>
            <Grid container sx={{justifyContent: 'center', paddingTop: '5vh'}}>
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
                                    fontSize: 24,
                                    width: 250
                                }
                            }}>
                            <Typography sx={{fontSize: 24, fontWeight: '700'}}>Номер вашего талона</Typography>
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
                    <div>Не нужно обновлять страницу!</div>
                    <div>Страница держит постоянное соединение с сервером!</div>
                </Alert>
            </Snackbar>
        </>
    )
}