import React from 'react'
import {AppBar, Box, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography} from "@mui/material"
import {useRouter} from "next/router"
import MenuIcon from '@mui/icons-material/Menu'
import {useAuth} from "@/providers/AuthProvider"
import {NavigationButtonLogout} from "@/components/navigation/NavigationButton"
import NavigationList from "@/components/navigation/NavigationList"
import logo from '/public/logo.png'
import Image from "next/image"

interface Props {
    isSidebarOpen: boolean
    sidebarToggle: () => void
}

const Header = ({isSidebarOpen, sidebarToggle}: Props) => {
    const router = useRouter()
    const {logout} = useAuth()

    return (
        <AppBar
            position="fixed"
            // sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}
        >
            <Toolbar sx={{justifyContent: 'space-betweeen'}}>
                <Box sx={{flexGrow: 1}}>
                    <Image src={logo} alt="IITU Logo" width={211} height={32}/>
                </Box>
                <Box sx={{
                    display: {
                        xs: 'none',
                        sm: 'block'
                    }
                }}>
                    <NavigationList isHeader={true}/>
                </Box>
                <IconButton
                    color="inherit"
                    onClick={sidebarToggle}
                    edge="start"
                    sx={{
                        display: {
                            sm: 'none'
                        }
                    }}
                >
                    <MenuIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header