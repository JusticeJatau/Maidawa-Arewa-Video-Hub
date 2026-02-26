import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useThemedStyles = (styleCreator) => {
  const { theme } = useTheme();
  
  return useMemo(
    () => styleCreator(theme),
    [theme, styleCreator]
  );
};