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

export const drawerWidth = 260


interface SidebarProps {
    isSidebarOpen: boolean
    toggleIsSidebarOpen: (isOpen: boolean) => void
}


const LogoutButton = () => {
    const {logout} = useAuth()

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={logout}>
                <ListItemIcon>
                    <ExitToAppIcon/>
                </ListItemIcon>
                <ListItemText primary='Выйти'/>
            </ListItemButton>
        </ListItem>
    )
}

const SidebarLink = ({path, title, icon}) => {
    const router = useRouter()

    const onClick = (path) => {
        void router.push(path)
    }

    return (
        <ListItem selected={router.pathname == path} disablePadding>
            <ListItemButton onClick={() => onClick(path)}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={title}/>
            </ListItemButton>
        </ListItem>
    )
}

const Sidebar = ({isSidebarOpen, toggleIsSidebarOpen}: SidebarProps) => {
    const {isAdmin, } = useAuth()
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

                </List>
                <LogoutButton/>
            </Box>
        </SwipeableDrawer>
    )
}

export default Sidebar