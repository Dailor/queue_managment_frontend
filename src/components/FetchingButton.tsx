import React from "react"
import {Box, Button, ButtonProps, CircularProgress} from "@mui/material"


interface CustomProps extends ButtonProps {
    isFetching: boolean
}

export const FetchingButton = React.forwardRef<HTMLElement, CustomProps>(
    function FetchingButton(props, ref) {
        const {sx, isFetching, children, ...other} = props

        return (
            <Button
                {...other}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    ...sx
                }}
                disabled={isFetching}
            >
                {isFetching && (
                    <CircularProgress
                        color="inherit"
                        style={{
                            height: '20px',
                            width: '20px'
                        }}/>
                )}
                <Box>
                    {children}
                </Box>
            </Button>
        )
    }
)
