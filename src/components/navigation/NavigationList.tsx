import {NavigationButton, NavigationButtonLogout} from "@/components/navigation/NavigationButton"
import {List} from "@mui/material"
import TerminalIcon from '@mui/icons-material/Terminal'
import React from "react"
import {useAuth} from "@/providers/AuthProvider"

interface Props {
    isHeader?: boolean
}

const NavigationList = ({isHeader}: Props) => {
    const {isTerminal} = useAuth()

    return (
        <List sx={{display: isHeader ? 'flex' : 'block'}}>
            {(isTerminal) && (
                <NavigationButton text={'Терминал'} icon={<TerminalIcon/>} to={'/terminal'}/>
            )}
            <NavigationButtonLogout/>
        </List>
    )
}

export default NavigationList