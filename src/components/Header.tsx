import React from 'react'
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material"
import {useRouter} from "next/router"
import MenuIcon from '@mui/icons-material/Menu'

interface Props {
    isSidebarOpen: boolean
    sidebarToggle: () => void
}

const Header = ({isSidebarOpen, sidebarToggle}: Props) => {
    const router = useRouter()

    return (
        <AppBar
            position="fixed"
            // sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}
        >
            <Toolbar sx={{justifyContent: 'space-betweeen'}}>
                <Box sx={{flexGrow: 1}}>
                    <Typography variant="h6" noWrap component="div">
                        IITU Admission Queue
                    </Typography>
                </Box>
                <IconButton
                    color="inherit"
                    onClick={sidebarToggle}
                    edge="start"
                    sx={{
                        ...(isSidebarOpen && {display: 'none'}),
                    }}
                >
                    <MenuIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header