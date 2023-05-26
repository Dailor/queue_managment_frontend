import Head from "next/head"
import React, {useEffect, useMemo, useRef, useState} from "react"
import {Box, Grid, Skeleton, Typography} from "@mui/material"
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
        return children
    }
    return <Skeleton {...skeletonProps} />
}

export default function TicketPage() {
    const router = useRouter()

    const ticketSocketRef = useRef<TicketSocketService>()

    const [ticketFull, setTicketFull] = useState<TicketHumanRead>()
    const [inFrontCount, setInFrontCount] = useState<number | null>(null)

    useEffect(() => {
        const ticketHash = router.query.ticketHash as string

        let responseStatusOK = true

        try {
            void loadUserMeRequestApi()

        } catch (e) {
            responseStatusOK = false
        }

        if (responseStatusOK) {
            ticketSocketRef.current = new TicketSocketService({setTicketFull, setInFrontCount})
            ticketSocketRef.current?.init(ticketHash)
        }

    }, [])

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


        return `${date.toLocaleDateString(locale, dateOptions).replace(/\//g, '.')} / ${date.toLocaleTimeString(locale, timeOptions)}`
    }, [ticketFull])

    let isLoaded = !!ticketFull && (inFrontCount !== null)

    return (
        <>
            <Head>
                <title>Талон</title>
            </Head>
            <Grid container sx={{justifyContent: 'center', paddingTop: 13}}>
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
                                    width: 120
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
                                                       variant='span'>{inFrontCount}</Typography> человек
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
                        <SkeletonPlaceHolderWrapper
                            isReady={isLoaded}
                            skeletonProps={{
                                variant: 'text', sx: {
                                    fontSize: 27,
                                    width: 290
                                }
                            }}>
                            <Typography sx={{fontSize: 24, fontWeight: '700'}}>Не пропустите очередь</Typography>
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
                                Смотрите номер талона на табло
                            </Typography>
                        </SkeletonPlaceHolderWrapper>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}