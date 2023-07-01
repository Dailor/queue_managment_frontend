import React from 'react'
import Brightness7Icon from "@mui/icons-material/Brightness7"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import {IconButton} from "@mui/material"
import {useTheme} from "@/providers/LocalThemeProvider"


const ThemeToggler = () => {
    const {theme, toggleColorMode} = useTheme()

    return (
        <IconButton sx={{ml: 1}} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
        </IconButton>
    )
}
export default ThemeToggler