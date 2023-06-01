import React, {createContext, useCallback, useContext} from 'react'

import * as ThemeSetup from "@/theme"
import {createTheme, Theme, ThemeProvider} from "@mui/material"


type ColorPaletteType = 'light' | 'dark'

type ColorModeContextType = {
    theme: Theme
    toggleColorMode: () => void
    setMode: (mode: ColorPaletteType) => void
}

interface LocalThemeProviderProps {
    children: React.ReactNode
}

export default function LocalThemeProvider({children}: LocalThemeProviderProps) {
    const [mode, setMode] = React.useState<ColorPaletteType>('light')

    const toggleColorMode = useCallback(() => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
    }, [])

    const theme = React.useMemo(
        () =>
            createTheme({
                ...ThemeSetup.theme,
                palette: {
                    ...ThemeSetup.theme.palette,
                    mode
                },
            }),
        [mode],
    )

    return (
        <ColorModeContext.Provider value={{toggleColorMode, setMode, theme}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

const ColorModeContext = createContext<ColorModeContextType | null>(null)

export function useTheme() {
    return useContext(ColorModeContext) as ColorModeContextType
}
