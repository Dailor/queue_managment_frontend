import {useAuth} from "@/providers/AuthProvider"
import {ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme} from "@mui/material"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import React, {useCallback} from "react"
import {useRouter} from "next/router"
import {UserRolesEnum} from "@/constants"

type NavigationButtonDefaultProps = {
    text: string
    userRole?: UserRolesEnum
    icon?: React.ReactNode
    to?: string
    onClick?: Function
}


export const NavigationButton = (props: NavigationButtonDefaultProps) => {
    const router = useRouter()
    const theme = useTheme()
    const upSm = useMediaQuery(theme.breakpoints.up('sm'))


    let onClick = useCallback(() => {
        if (props.onClick) {
            return props.onClick()
        }
        if (props.to) {
            return void router.push(props.to)
        }
    }, [props, router])

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
                {!upSm && props.icon && (
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                )}
                <ListItemText primary={props.text}
                              sx={{
                                  '& .MuiListItemText-primary': {
                                      fontWeight: 600
                                  }
                              }}/>
            </ListItemButton>
        </ListItem>
    )
}

export const NavigationButtonLogout = () => {
    const {isAuth, logout} = useAuth()
    if (isAuth)
        return <NavigationButton icon={<ExitToAppIcon/>} onClick={logout} text={'Выйти'}/>
    return <></>
}