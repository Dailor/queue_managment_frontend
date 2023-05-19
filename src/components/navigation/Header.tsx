import React from 'react'
import {AppBar, Box, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography} from "@mui/material"
import {useRouter} from "next/router"
import MenuIcon from '@mui/icons-material/Menu'
import {useAuth} from "@/providers/AuthProvider"

interface Props {
    isSidebarOpen: boolean
    sidebarToggle: () => void
}

const Header = ({isSidebarOpen, sidebarToggle}: Props) => {
    const router = useRouter()
    const {logout} = useAuth()


    const logoutButtonRender = () => {
        return (
            <ListItem disablePadding>
                <ListItemButton sx={{textAlign: 'center'}}>
                    <ListItemText primary={'Выход'}/>
                </ListItemButton>
            </ListItem>
        )
    }

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
                <Box sx={{
                    display: {
                        xs: 'none',
                        sm: 'block'
                    }
                }}>
                    <List>
                        {logoutButtonRender()}
                    </List>
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