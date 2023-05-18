import {useAuth} from "@/providers/AuthProvider"
import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import React, {useCallback} from "react"
import {useRouter} from "next/router"

type NavigationButtonDefaultProps = {
    text: string
    icon: React.ReactNode | undefined
}

type NavigationButtonWithPathProps = NavigationButtonDefaultProps & {
    to: string
}

type NavigationButtonWithClickProps = NavigationButtonDefaultProps &
    {
        onClick: Function
    }

type NavigationButtonProps = NavigationButtonWithPathProps | NavigationButtonWithClickProps

export const NavigationButton = (props: NavigationButtonProps) => {
    const router = useRouter()
    const onClickProps = (props as NavigationButtonWithClickProps).onClick
    const pathProps = (props as NavigationButtonWithPathProps).to


    let onClick = useCallback(() => {
        if (onClickProps) {
            return onClickProps()
        }
        return router.push(pathProps)
    }, [onClickProps, pathProps, router])

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
                {props.icon && (
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                )}
                <ListItemText primary={props.text}/>
            </ListItemButton>
        </ListItem>
    )
}

export const NavigationButtonLogout = () => {
    const {logout} = useAuth()

    return <NavigationButton icon={<ExitToAppIcon/>} onClick={logout} text={'Выйти'}/>
}