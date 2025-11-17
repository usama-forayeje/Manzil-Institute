import React, { createContext, useContext, useEffect, useState } from 'react'

// Theme provider context
const ThemeProviderContext = createContext()

export function ThemeProvider({
    children,
    defaultTheme = 'dark',
    storageKey = 'vite-ui-theme',
    ...props
}) {
    const [theme, setThemeState] = useState(defaultTheme)

    useEffect(() => {
        const storedTheme = localStorage.getItem(storageKey)
        if (storedTheme) {
            setThemeState(storedTheme)
        }
    }, [storageKey])

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [theme])

    const setTheme = (newTheme) => {
        setThemeState(newTheme)
        localStorage.setItem(storageKey, newTheme)
    }

    const value = {
        theme,
        setTheme,
        resolvedTheme: theme
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
