import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const themeOptions = [
  { value: 'light', labelKey: 'theme.light', icon: Sun },
  { value: 'dark', labelKey: 'theme.dark', icon: Moon },
  { value: 'system', labelKey: 'theme.system', icon: Monitor },
]

export function ThemeToggle({ className, showLabels = false }) {
  const { t } = useTranslation()
  const { setTheme, theme = 'system' } = useTheme()

  return (
    <div className={cn('flex items-center gap-1 rounded-xl border bg-background p-1', className)}>
      {themeOptions.map((option) => {
        const Icon = option.icon
        const isActive = theme === option.value
        const label = t(option.labelKey)

        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={isActive ? 'default' : 'ghost'}
            aria-label={label}
            title={label}
            onClick={() => setTheme(option.value)}
          >
            <Icon className="size-4" />
            {showLabels && <span>{label}</span>}
          </Button>
        )
      })}
    </div>
  )
}
