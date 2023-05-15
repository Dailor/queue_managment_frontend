import React from 'react'
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material"
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
            <Toolbar>
                <IconButton
                    color="inherit"
                    onClick={sidebarToggle}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(isSidebarOpen && {display: 'none'}),
                    }}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    IITU Finance Things
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Header