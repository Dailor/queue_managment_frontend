import React, {useState} from 'react'
import {
    AppBar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Slide,
    Toolbar,
    Typography
} from "@mui/material"
import {useRouter} from "next/router"
import MenuIcon from '@mui/icons-material/Menu'
import {useAuth} from "@/providers/AuthProvider"
import {NavigationButtonLogout} from "@/components/navigation/NavigationButton"
import NavigationList from "@/components/navigation/NavigationList"
import logo from '/public/logo.png'
import Image from "next/image"
import {useTheme} from "@/providers/LocalThemeProvider";

interface Props {
    isSidebarOpen: boolean
    sidebarToggle: () => void
}

const Header = ({sidebarToggle}: Props) => {
    const {isShowHeader} = useTheme()

    return (
        <Slide direction="down" in={isShowHeader} mountOnEnter unmountOnExit appear={false}>
            <AppBar
                position="fixed"
                // sx={{display: isHidden ? 'hidden' : 'block'}}
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
        </Slide>
    )
}

export default Header