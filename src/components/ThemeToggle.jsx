import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme/ThemeContext.jsx'
import { Button } from './ui/button.jsx'
import { cn } from '../lib/utils.js'

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn('bg-background/70 backdrop-blur-sm', className)}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </Button>
  )
}
