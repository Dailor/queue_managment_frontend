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

const callNextVoiceSynthesis = (windowNumber: number, ticketNumber: number) => {
    const audio = new Audio('/sounds/client_caller.mp3')
    audio.volume = 1
    audio.play()
}
const DashboardRow = ({isHeader, window, ticket, createdAt}: DashboardRowProps) => {
    const typographyVariant = isHeader ? 'h2' : 'h3'
    const fontWeight = isHeader ? 'normal' : 'bold'

    const borderTop = isHeader ? '3px solid' : undefined
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
            <Box sx={{flexBasis: '30%', marginRight: 6, borderTop, borderRight, borderBottom, p: 1.2}}>
                <Typography variant={typographyVariant}
                            fontWeight={fontWeight}>{window}</Typography></Box>
            <Box sx={{flexBasis: '70%', borderTop, borderBottom, borderLeft, p: 1.2}}>
                <Typography variant={typographyVariant}
                            fontWeight={fontWeight}>{ticket}</Typography></Box>
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

type DashboardActionType = 'ADD_NEW'

type DashboardAction = {
    payload: {
        window: number
        ticket: number
    }
    type: DashboardActionType
}


const dashboardReducer = (state: DashboardState, action: DashboardAction) => {
    const {payload, type} = action
    switch (type) {
        case "ADD_NEW":
            return {
                ...state,
                windows: {
                    ...state.windows,
                    [payload.window]: {
                        ticket: payload.ticket,
                        createdAt: (new Date()).getTime()
                    }
                }
            }
        default:
            return {...state}
    }
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

        callNextVoiceSynthesis(window, ticket)
    }, [])

    useEffect(() => {
        loadUserMeRequestApi()
            .then(() => {
                dashboardSocketRef.current = new DashboardSocketService({
                    addNewOnDashboard,
                    setInQueueCount,
                    toggleIsSocketClosed
                })
                dashboardSocketRef.current?.init(getAccessTokenFromLocalStorage() as string)
            })
    }, [addNewOnDashboard])

    return (
        <>
            <Head>
                <title>Табло</title>
            </Head>
            <Container sx={{position: 'relative', marginBottom: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'end'}}>
                    <HeaderShowToggler />
                    <ThemeToggler />
                </Box>
                <Box>
                    <DashboardRow isHeader={true}
                                  window={'Окно'}
                                  ticket={'Талон'}/>
                    <Box>
                        {Object.keys(windowToTicket.windows).map(window => {
                            const {ticket, createdAt} = windowToTicket.windows[window as unknown as number]

                            return <DashboardRow window={window} ticket={ticket} createdAt={createdAt} key={createdAt}/>
                        })}
                    </Box>
                </Box>
            </Container>
        </>
    )
}