/**
 * Manzil Institute Management System — Global Color Schema
 * Based on the official logo and high-fidelity branding guidelines.
 */

export const colors = {
  primary: {
    DEFAULT: '#00AEEF',
    foreground: '#FFFFFF',
    hover: '#0090C5',
    light: '#76DAFF',
    dark: '#007AA7',
  },
  secondary: {
    DEFAULT: '#1E293B',
    foreground: '#F8FAFC',
    accent: '#334155',
  },
  success: {
    DEFAULT: '#10B981',
    foreground: '#FFFFFF',
  },
  warning: {
    DEFAULT: '#F59E0B',
    foreground: '#FFFFFF',
  },
  destructive: {
    DEFAULT: '#EF4444',
    foreground: '#FFFFFF',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    }
  },
  // Appwrite-inspired Deep Dark Theme
  appwrite: {
    background: '#19191C',
    card: '#232325',
    border: '#2C2C2F',
    foreground: '#F9F9FB',
  }
} as const;

export type ColorSchema = typeof colors;
