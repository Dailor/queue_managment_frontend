import React from 'react'
import {IconButton} from "@mui/material"
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'

interface Props {
    isEnabled: boolean
    toggleIsEnabled: () => void
}

const TTSVoiceToggler = ({isEnabled, toggleIsEnabled}: Props) => {
    return (
        <IconButton sx={{ml: 1}} onClick={toggleIsEnabled} color="inherit">
            {isEnabled ? <MicIcon/> : <MicOffIcon/>}
        </IconButton>
    )
}
export default TTSVoiceToggler