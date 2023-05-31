import {NavigationButton, NavigationButtonLogout} from "@/components/navigation/NavigationButton"
import {List} from "@mui/material"
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import GroupIcon from '@mui/icons-material/Group'
import TabletMacIcon from '@mui/icons-material/TabletMac'
import React from "react"
import {useAuth} from "@/providers/AuthProvider"

interface Props {
    isHeader?: boolean
}

const NavigationList = ({isHeader}: Props) => {
    const {isTerminal, isOperator, isDashboard} = useAuth()

    return (
        <List sx={{display: isHeader ? 'flex' : 'block'}}>
            {(isTerminal) && (
                <NavigationButton text={'Терминал'} icon={<ConfirmationNumberIcon/>} to={'/terminal'}/>
            )}
            {(isOperator) && (
                <NavigationButton text={'Оператор'} icon={<GroupIcon/>} to={'/operator'}/>
            )}
            {(isDashboard) && (
                <NavigationButton text={'Табло'} icon={<TabletMacIcon/>} to={'/dashboard'}/>
            )}
            <NavigationButtonLogout/>
        </List>
    )
}

export default NavigationList