import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Colors, DarkColors } from "../utils/colors";
import { selectThemeMode, setThemeMode } from "../store/themeSlice";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const systemColorScheme = useColorScheme();

  // Aktif temayi hesapla
  const isDark = useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark";
    }
    return themeMode === "dark";
  }, [themeMode, systemColorScheme]);

  // Aktif renkleri sec
  const colors = useMemo(() => {
    return isDark ? DarkColors : Colors;
  }, [isDark]);

  // Tema degistirme fonksiyonu
  const setTheme = (mode) => {
    dispatch(setThemeMode(mode));
  };

  // Hizli tema degistirme (toggle)
  const toggleTheme = () => {
    const newMode = isDark ? "light" : "dark";
    dispatch(setThemeMode(newMode));
  };

  const value = useMemo(
    () => ({
      isDark,
      colors,
      themeMode,
      setTheme,
      toggleTheme,
    }),
    [isDark, colors, themeMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// useTheme hook - renklere ve tema fonksiyonlarina erisim
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
