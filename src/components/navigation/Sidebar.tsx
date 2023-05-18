import React, {useEffect} from 'react'
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader, SwipeableDrawer,
    Toolbar
} from "@mui/material"

import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import {useAuth} from "@/providers/AuthProvider"

import Image from "next/image"
import {useRouter} from "next/router"

import {adminLinks, directorLinks} from '@/links'
import logo from '/public/logo.png'
import {NavigationButtonLogout} from "@/components/navigation/NavigationButton";

export const drawerWidth = 260


interface SidebarProps {
    isSidebarOpen: boolean
    toggleIsSidebarOpen: (isOpen: boolean) => void
}

const Sidebar = ({isSidebarOpen, toggleIsSidebarOpen}: SidebarProps) => {
    const {isAdmin, isDashboard, isOperator} = useAuth()

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
                <List>

                    <NavigationButtonLogout/>
                </List>
            </Box>
        </SwipeableDrawer>
    )
}

export default Sidebar