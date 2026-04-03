export const DEFAULT_THEME = 'light';

export interface ThemeConfig {
  name: string;
  value: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
    destructive: string;
    destructiveForeground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    sidebar: string;
    sidebarForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarMuted: string;
    sidebarMutedForeground: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarBorder: string;
    sidebarRing: string;
  };
}

export const THEMES: ThemeConfig[] = [
  {
    name: 'Light',
    value: 'light',
  },
  {
    name: 'Dark',
    value: 'dark',
  },
];
