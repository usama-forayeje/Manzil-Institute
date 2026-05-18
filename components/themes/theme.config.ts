export const DEFAULT_THEME = 'manzil';

export interface ThemeConfig {
  name: string;
  value: string;
}

export const THEMES: ThemeConfig[] = [
  {
    name: 'Manzil (Official)',
    value: 'manzil',
  },
  {
    name: 'Zinc',
    value: 'zinc',
  },
  {
    name: 'Slate',
    value: 'slate',
  },
];
