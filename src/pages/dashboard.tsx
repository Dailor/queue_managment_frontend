import React, {useCallback, useEffect, useMemo, useReducer, useRef, useState} from "react"
import {Box, Container, Grid, IconButton, Typography} from "@mui/material"
import Head from "next/head"

import DashboardSocketService from "@/services/dashboardSocket"
import {loadUserMeRequestApi} from "@/providers/AuthProvider.api"
import {getAccessTokenFromLocalStorage} from "@/utilities/jwt"
import HeaderShowToggler from "@/components/HeaderShowToggler"
import ThemeToggler from "@/components/ThemeToggler"

const BLINKING_TIME = 5 * 1000

type DashboardRowProps = {
    isHeader?: boolean
    window: number | string
    ticket: number | string
    createdAt?: number
}

const callNexMusicPlay = () => {
    const audio = new Audio('/sounds/client_caller.mp3')
    audio.volume = 1
    audio.play()
}

const DashboardRow = ({isHeader, window, ticket, createdAt}: DashboardRowProps) => {
    const typographyVariant = isHeader ? 'h2' : 'h1'
    const fontWeight = isHeader ? 'normal' : 'bold'

    const borderTop = undefined
    const borderRight = '3px solid'
    const borderBottom = isHeader ? '3px solid' : undefined
    const borderLeft = isHeader ? '3px solid' : undefined

    const [isBlinking, toggleIsBlinking] = useState<boolean>(false)

    useEffect(() => {
        if (createdAt) {
            toggleIsBlinking(true)

            const intervalID = setInterval(() => {
                    const nowAtInt = (new Date()).getTime()

                    if (nowAtInt - createdAt > BLINKING_TIME) {
                        toggleIsBlinking(false)
                        clearInterval(intervalID)
                    }
                },
                200)
        }
    }, [createdAt])

    return (
        <Box sx={{
            display: 'flex', textAlign: 'center',
            '&': {
                marginBottom: 3
            },
        }}>
            <Box sx={{flexBasis: '40%', marginRight: 6, borderTop, borderRight, borderBottom, p: 1.2}}>
                <Typography variant={typographyVariant}
                            fontWeight={fontWeight}>{ticket}</Typography></Box>
            <Box sx={{flexBasis: '60%', borderTop, borderBottom, borderLeft, p: 1.2}}>
                <Typography variant={typographyVariant}
                            fontWeight={fontWeight}>{window}</Typography></Box>
        </Box>
    )
}

type DashboardState = {
    windows: {
        [key: number]: {
            ticket: number,
            createdAt: number
        }
    }
}

type DashboardActionType = 'ADD_NEW' | 'ADD_LIST'

type PayloadAddNew = {
    window: number
    ticket: number
}

type PayloadLoadList = {
    windows_to_ticket_numbers: PayloadAddNew[]
}

type PayloadTypes = PayloadAddNew | PayloadLoadList

type DashboardAction = {
    payload: PayloadTypes
    type: DashboardActionType
}

const handleTicket = (item: PayloadAddNew) => {
    return {
        ticket: item.ticket,
        createdAt: (new Date()).getTime()
    }
}

const formatToWindowNumberToTicket = (windows_to_ticket_numbers: PayloadAddNew[]) => {
    const r = {}

    windows_to_ticket_numbers.map(item => {
        r[item.window] = handleTicket(item)
    })

    return r
}

const dashboardReducer = (state: DashboardState, action: DashboardAction) => {
    const {payload, type} = action
    if (type === "ADD_NEW") {
        const payloadAsAddNew = payload as PayloadAddNew

        return {
            ...state,
            windows: {
                ...state.windows,
                [payloadAsAddNew.window]: handleTicket(payloadAsAddNew)
            }
        }
    } else if (type === "ADD_LIST") {
        const payloadAsLoadList = payload as PayloadLoadList

        return {
            ...state,
            windows: {
                ...state.windows,
                ...formatToWindowNumberToTicket(payloadAsLoadList.windows_to_ticket_numbers)
            }
        }
    }
    return {...state}
}

export default function DashboardPage() {
    const [windowToTicket, dispatcherWindowToTicket] = useReducer(dashboardReducer, {
        windows: {},
    })
    const [inQueueCount, setInQueueCount] = useState<number>()

    const dashboardSocketRef = useRef<DashboardSocketService>()
    const [isSocketClosed, toggleIsSocketClosed] = useState()

    const addNewOnDashboard = useCallback((window: number, ticket: number) => {
        dispatcherWindowToTicket({
            type: 'ADD_NEW',
            payload: {window, ticket}
        })

        callNexMusicPlay()
    }, [])

    const loadListOnDashboard = useCallback((windows_to_ticket_numbers: PayloadAddNew[]) => {
        dispatcherWindowToTicket({
            type: 'ADD_LIST',
            payload: {windows_to_ticket_numbers}
        })

        callNexMusicPlay()
    }, [])

    useEffect(() => {
        loadUserMeRequestApi()
            .then(() => {
                dashboardSocketRef.current = new DashboardSocketService({
                    addNewOnDashboard,
                    setInQueueCount,
                    toggleIsSocketClosed,
                    loadListOnDashboard
                })
                dashboardSocketRef.current?.init(getAccessTokenFromLocalStorage() as string)
            })
    }, [addNewOnDashboard, loadListOnDashboard])

    return (
        <>
            <Head>
                <title>Табло</title>
            </Head>
            <Container sx={{position: 'relative', marginBottom: 3, height: '100vh'}}>
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
                        <ThemeToggler/>
                    </Box>
                </Box>
                <Box sx={{border: 3, height: '100%'}}>
                    <DashboardRow isHeader={true}
                                  window={'Подойдите к окну'}
                                  ticket={'Ваш талон'}/>
                    <Box>
                        {Object.keys(windowToTicket.windows).map(window => {
                            const {ticket, createdAt} = windowToTicket.windows[window as unknown as number]

                            return <DashboardRow window={window} ticket={ticket} createdAt={createdAt} key={window}/>
                        })}
                    </Box>
                </Box>
            </Container>
        </>
    )
}