import { useTheme } from '@/components/themes/theme-provider'
import * as React from 'react'
import { useOptimistic } from 'react'

import { Button } from '@/components/ui/button'
import { Sun } from 'lucide-react'
import { Moon } from 'lucide-react'

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(resolvedTheme)

  const handleThemeToggle = React.useCallback(
    (e) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark'
      const root = document.documentElement

      // Optimistically update the theme for instant feedback
      setOptimisticTheme(newMode)

      if (!document.startViewTransition) {
        setTheme(newMode)
        return
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`)
        root.style.setProperty('--y', `${e.clientY}px`)
      }

      document.startViewTransition(() => {
        setTheme(newMode)
      })
    },
    [resolvedTheme, setTheme, setOptimisticTheme],
  )

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleThemeToggle}
      className="relative"
    >
      <Sun className={`h-4 w-4 rotate-0 scale-100 transition-all ${optimisticTheme === 'dark' ? '-rotate-90 scale-0' : ''}`} />
      <Moon className={`absolute h-4 w-4 rotate-90 scale-0 transition-all ${optimisticTheme === 'dark' ? 'rotate-0 scale-100' : ''}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
