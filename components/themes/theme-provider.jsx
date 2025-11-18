"use client";

import React, { createContext, useContext, useEffect, useState } from 'react'

// Theme provider context
const ThemeProviderContext = createContext()

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey = 'manzil-theme',
    ...props
}) {
    const [theme, setThemeState] = useState(defaultTheme)

    useEffect(() => {
        // Get theme from localStorage on client
        const storedTheme = localStorage.getItem(storageKey)
        if (storedTheme && storedTheme !== theme) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setThemeState(storedTheme)
        }
    }, [storageKey]) // Remove theme from dependencies to avoid cascading renders

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
