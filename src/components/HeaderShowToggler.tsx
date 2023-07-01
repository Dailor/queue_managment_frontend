import React from 'react'
import {useTheme} from "@/providers/LocalThemeProvider"
import {IconButton} from "@mui/material"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

const HeaderShowToggler = () => {
    const {isShowHeader, toggleShowHeader} = useTheme()

    return (
        <IconButton sx={{ml: 1}} onClick={toggleShowHeader} color="inherit">
            {isShowHeader ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>}
        </IconButton>
    )
}

export default HeaderShowToggler