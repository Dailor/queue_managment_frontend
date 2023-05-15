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

import {adminLinks, commonLinks, directorLinks} from '@/links'
import logo from '/public/logo.png'

export const drawerWidth = 260

interface SidebarLinksProps {
    heading: string
    prefix?: string
    links: Links
}

interface SidebarProps {
    isSidebarOpen: boolean
    toggleIsSidebarOpen: (isOpen: boolean) => void
}

const SidebarLinks = ({prefix, heading, links}: SidebarLinksProps) => {
    const router = useRouter()

    const processPath = (path) => {
        return (prefix || '') + path
    }

    const onClick = (link) => {
        void router.push(link)
    }

    return (
        <>
            <Divider/>
            <List
                subheader={
                    <ListSubheader component="div">
                        {heading}
                    </ListSubheader>
                }>
                {links.map((link, index) => {
                    const processedLink = processPath(link.to)

                    return <ListItem key={index} selected={router.pathname == processedLink} disablePadding>
                        <ListItemButton onClick={() => onClick(processedLink)}>
                            <ListItemIcon>
                                {link.icon}
                            </ListItemIcon>
                            <ListItemText primary={link.title}/>
                        </ListItemButton>
                    </ListItem>
                })}
            </List>
        </>
    )
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

const Sidebar = ({isSidebarOpen, toggleIsSidebarOpen}: SidebarProps) => {
    const {isAdmin, isDirector} = useAuth()
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

    const list = () => {
        return <>
            {isAdmin && (
                <SidebarLinks {...adminLinks}/>
            )}
            {isDirector && (
                <SidebarLinks {...directorLinks}/>
            )}
            <SidebarLinks {...commonLinks}/>
            <LogoutButton/>
        </>
    }

    return (
        <SwipeableDrawer
            sx={{width: drawerWidth}}
            open={isSidebarOpen}
            onOpen={toggleDrawer(true)}
            onClose={toggleDrawer(false)}
            variant="temporary"
            anchor="left">
            <Box>
                <Toolbar sx={{'backgroundColor': 'primary.main'}}>
                    <Image src={logo} alt="IITU Logo" width={211} height={32}/>
                </Toolbar>
                {list()}
            </Box>
        </SwipeableDrawer>
    )
}

export default Sidebar