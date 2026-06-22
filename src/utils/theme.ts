import { themes } from '@/utils/componentRegistry'
import type { ThemeConfig } from '@/types'

export function getThemeById(id: string): ThemeConfig {
  return themes.find(t => t.id === id) || themes[0]
}

export function applyTheme(themeId: string): void {
  const theme = getThemeById(themeId)
  const root = document.documentElement
  const primaryRgb = hexToRgb(theme.primaryColor)

  root.style.setProperty('--theme-primary', theme.primaryColor)
  root.style.setProperty('--theme-secondary', theme.secondaryColor)
  root.style.setProperty('--theme-bg', theme.backgroundColor)
  root.style.setProperty('--theme-text', theme.textColor)
  root.style.setProperty('--theme-border', theme.borderColor)
  if (primaryRgb) {
    root.style.setProperty('--theme-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`)
  }
}

export function generateCssVars(themeId: string): Record<string, string> {
  const theme = getThemeById(themeId)
  const primaryRgb = hexToRgb(theme.primaryColor)
  const vars: Record<string, string> = {
    '--theme-primary': theme.primaryColor,
    '--theme-secondary': theme.secondaryColor,
    '--theme-bg': theme.backgroundColor,
    '--theme-text': theme.textColor,
    '--theme-border': theme.borderColor,
  }
  if (primaryRgb) {
    vars['--theme-primary-rgb'] = `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`
  }
  return vars
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}
