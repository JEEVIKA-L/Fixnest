import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
 theme: Theme;
 setTheme: (theme: Theme) => void;
 initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
 theme: 'light',
 setTheme: (theme) => {
 set({ theme });
 if (typeof document !== 'undefined') {
 const root = document.documentElement;
 if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
 root.classList.add('dark');
 } else {
 root.classList.remove('dark');
 }
 
 // Save to localStorage
 localStorage.setItem('fixnest-theme', theme);
 }
 },
 initTheme: () => {
 if (typeof window !== 'undefined') {
 const savedTheme = localStorage.getItem('fixnest-theme') as Theme;
 if (savedTheme) {
 set({ theme: savedTheme });
 const root = document.documentElement;
 if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
 root.classList.add('dark');
 } else {
 root.classList.remove('dark');
 }
 }
 }
 }
}));
