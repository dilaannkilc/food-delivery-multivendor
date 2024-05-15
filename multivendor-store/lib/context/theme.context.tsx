
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Colors } from "@/lib/utils/constants";

import { AppThemeContext } from "@/lib/utils/interfaces/app-theme";
import { app_theme } from "@/lib/utils/types/theme";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Appearance } from "react-native";

const ThemeContext = createContext<AppThemeContext>({
  currentTheme: "light",
  toggleTheme: () => {},
  appTheme: Colors.light,
});

export default function AppThemeProvidor({
  children,
}: {
  children: ReactNode;
}) {

  const colorScheme = Appearance.getColorScheme();

  const [currentTheme, setCurrentTheme] = useState<app_theme>("light");
  const [appTheme, setAppTheme] = useState(
    colorScheme === "dark"
      ? Colors.dark
      : colorScheme === "light"
        ? Colors.light
        : Colors.light,
  );

  async function getCurrentAppTheme() {
    const systemTheme = Appearance.getColorScheme();
    const localTheme = await AsyncStorage.getItem("app_theme");
    const theme = localTheme || systemTheme || "dark";
    Appearance.setColorScheme(theme as app_theme);
    setCurrentTheme(theme as app_theme);
    setAppTheme(
      theme === "light"
        ? Colors.light
        : theme === "dark"
          ? Colors.dark
          : Colors.light,
    );
  }

  const toggleTheme = (val: app_theme) => {
    const updatedVal = val === "light" ? "dark" : "light";
    setAppTheme(Colors[updatedVal] ?? Colors.light);
    setCurrentTheme(updatedVal);

    AsyncStorage.setItem("app_theme", updatedVal);
  };

  useEffect(() => {
    getCurrentAppTheme();
  }, [colorScheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentTheme(colorScheme as app_theme);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <ThemeContext.Provider
      value={{ toggleTheme, currentTheme: currentTheme, appTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useApptheme = () => useContext(ThemeContext);
