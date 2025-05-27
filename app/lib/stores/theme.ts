import { atom } from 'nanostores';
import { logStore } from './logs';

export type Theme = 'dark' | 'light';

export const kTheme = 'bolt_theme';

export function themeIsDark() {
  return themeStore.get() === 'dark';
}

export const DEFAULT_THEME = 'light';

export const themeStore = atom<Theme>(initStore());

function initStore() {
  // Always force light mode as the initial theme
  // Set localStorage to light theme if we're in the browser
  if (!import.meta.env.SSR) {
    localStorage.setItem(kTheme, 'light' as Theme);
    document.querySelector('html')?.setAttribute('data-theme', 'light');
    
    // Update user profile if it exists to use light theme
    try {
      const userProfile = localStorage.getItem('bolt_user_profile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        profile.theme = 'light' as Theme;
        localStorage.setItem('bolt_user_profile', JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Error setting initial user profile theme:', error);
    }
  }
  
  // Always return light regardless of existing settings
  return 'light' as Theme;
}

export function toggleTheme() {
  const currentTheme = themeStore.get();
  // Force light mode only by commenting out the conditional
  // const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const newTheme = 'light' as Theme; // Always use light theme

  // Update the theme store
  themeStore.set(newTheme);

  // Update localStorage
  localStorage.setItem(kTheme, newTheme);

  // Update the HTML attribute
  document.querySelector('html')?.setAttribute('data-theme', newTheme);

  // Update user profile if it exists
  try {
    const userProfile = localStorage.getItem('bolt_user_profile');

    if (userProfile) {
      const profile = JSON.parse(userProfile);
      profile.theme = newTheme;
      localStorage.setItem('bolt_user_profile', JSON.stringify(profile));
    }
  } catch (error) {
    console.error('Error updating user profile theme:', error);
  }

  logStore.logSystem(`Theme changed to ${newTheme} mode`);
}
