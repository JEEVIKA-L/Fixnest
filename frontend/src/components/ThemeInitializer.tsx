'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

export function ThemeInitializer() {
 useEffect(() => {
 useThemeStore.getState().initTheme();
 }, []);
 return null;
}
