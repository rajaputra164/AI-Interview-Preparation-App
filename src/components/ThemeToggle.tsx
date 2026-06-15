import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="button-secondary" onClick={toggleTheme} type="button">
      {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}