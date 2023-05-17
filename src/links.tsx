import PeopleIcon from '@mui/icons-material/People'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import BusinessIcon from '@mui/icons-material/Business'
import TurnedInIcon from '@mui/icons-material/TurnedIn'
import CategoryIcon from '@mui/icons-material/Category'
import NoteIcon from '@mui/icons-material/Note'

interface IRoleLinks {
    heading: string
    prefix: string
    links: Links
}

export const adminLinks: IRoleLinks = {
    heading: 'Администратор',
    prefix: '/admin',
    links: [
        {
            icon: <PeopleIcon/>,
            title: 'Пользователи',
            to: '/users',
        },
    ]
}

export const directorLinks: IRoleLinks = {
    heading: 'Dashboard',
    prefix: '/dashboard',
    links: [
        {
            icon: <SpaceDashboardIcon/>,
            title: 'Dashboard',
            to: '#'
        }
    ]
}

export const operatorLinks: IRoleLinks = {
    heading: 'Оператор',
    prefix: '/operator',
    links: [
        {
            icon: <NoteIcon/>,
            title: 'Обслуживание',
            to: '#'
        }
    ]
}