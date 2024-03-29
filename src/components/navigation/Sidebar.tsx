import React, {useEffect} from 'react'
import {
    Box,
    SwipeableDrawer,
    Toolbar
} from "@mui/material"


import {useAuth} from "@/providers/AuthProvider"

import Image from "next/image"
import {useRouter} from "next/router"

import logo from '/public/logo.png'
import NavigationList from "@/components/navigation/NavigationList"

export const drawerWidth = 260


interface SidebarProps {
    isSidebarOpen: boolean
    toggleIsSidebarOpen: (isOpen: boolean) => void
}

const Sidebar = ({isSidebarOpen, toggleIsSidebarOpen}: SidebarProps) => {
    const router = useRouter()

    useEffect(() => {
        toggleIsSidebarOpen(false)
    }, [router.pathname, toggleIsSidebarOpen])

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return
                }

                toggleIsSidebarOpen(open)
            }

    return (
        <SwipeableDrawer
            sx={{width: drawerWidth}}
            open={isSidebarOpen}
            onOpen={toggleDrawer(true)}
            onClose={toggleDrawer(false)}
            variant="temporary"
            anchor="right">
            <Box>
                <Toolbar sx={{'backgroundColor': 'primary.main'}}>
                    <Image src={logo} alt="IITU Logo" width={211} height={32}/>
                </Toolbar>
                <NavigationList/>
            </Box>
        </SwipeableDrawer>
    )
}

export default Sidebar