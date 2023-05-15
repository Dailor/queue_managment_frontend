import {createTheme} from "@mui/material";


export const theme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#b1040e',
            },
            secondary: {
                main: '#6C757D',
            },
            success: {
                main: '#2acb33',
            },
            info: {
                main: '#3E7DE2',
            },
        },
        typography: {
            fontFamily: [
                'Inter',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    }
)