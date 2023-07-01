import React from 'react'
import {
    AppBar,
    Box,
    IconButton,
    Slide,
    Toolbar,
} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import NavigationList from "@/components/navigation/NavigationList"
import logo from '/public/logo.png'
import Image from "next/image"
import {useTheme} from "@/providers/LocalThemeProvider"

interface Props {
    isSidebarOpen: boolean
    sidebarToggle: () => void
}

const Header = ({sidebarToggle}: Props) => {
    const {isShowHeader} = useTheme()

    return (
        <Slide direction="down" in={isShowHeader} mountOnEnter unmountOnExit appear={false}>
            <AppBar position="fixed">
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