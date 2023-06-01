import {createTheme} from "@mui/material"

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        span: true;
    }
}

export const theme = {
    palette: {
        primary: {
            main: '#b1040e',
        },
        secondary: {
            main: '#909090',
        },
        success: {
            main: '#2acb33',
        },
        info: {
            main: '#3E7DE2',
        }
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
    components: {
        MuiTypography: {
            defaultProps: {
                variantMapping: {
                    h1: 'h2',
                    h2: 'h2',
                    h3: 'h2',
                    h4: 'h2',
                    h5: 'h2',
                    h6: 'h2',
                    subtitle1: 'h2',
                    subtitle2: 'h2',
                    body1: 'span',
                    body2: 'span',
                    span: 'span'
                },
            },
        },
    },
}