import { useState, useEffect, createContext, useContext, useCallback } from "react";

export type ThemeName = "cyber-green" | "neon-purple" | "sunset-orange";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: { name: ThemeName; label: string; accent: string }[];
}

const THEMES: Record<ThemeName, Record<string, string>> = {
  "cyber-green": {
    "--primary": "152 100% 50%",
    "--primary-foreground": "150 10% 6%",
    "--accent": "152 100% 50%",
    "--accent-foreground": "150 10% 6%",
    "--ring": "152 100% 50%",
    "--sidebar-primary": "152 100% 50%",
    "--sidebar-primary-foreground": "150 10% 6%",
    "--sidebar-ring": "152 100% 50%",
  },
  "neon-purple": {
    "--primary": "270 100% 65%",
    "--primary-foreground": "270 10% 6%",
    "--accent": "270 100% 65%",
    "--accent-foreground": "270 10% 6%",
    "--ring": "270 100% 65%",
    "--sidebar-primary": "270 100% 65%",
    "--sidebar-primary-foreground": "270 10% 6%",
    "--sidebar-ring": "270 100% 65%",
  },
  "sunset-orange": {
    "--primary": "25 100% 55%",
    "--primary-foreground": "25 10% 6%",
    "--accent": "25 100% 55%",
    "--accent-foreground": "25 10% 6%",
    "--ring": "25 100% 55%",
    "--sidebar-primary": "25 100% 55%",
    "--sidebar-primary-foreground": "25 10% 6%",
    "--sidebar-ring": "25 100% 55%",
  },
};

export const THEME_META: { name: ThemeName; label: string; accent: string }[] = [
  { name: "cyber-green", label: "Cyber Green", accent: "hsl(152, 100%, 50%)" },
  { name: "neon-purple", label: "Neon Purple", accent: "hsl(270, 100%, 65%)" },
  { name: "sunset-orange", label: "Sunset Orange", accent: "hsl(25, 100%, 55%)" },
];

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyber-green",
  setTheme: () => {},
  themes: THEME_META,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem("dvzoll-theme") as ThemeName) || "cyber-green";
  });

  const applyTheme = useCallback((name: ThemeName) => {
    const vars = THEMES[name];
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  const setTheme = useCallback(
    (name: ThemeName) => {
      setThemeState(name);
      localStorage.setItem("dvzoll-theme", name);
      applyTheme(name);
    },
    [applyTheme]
  );

  useEffect(() => {
    applyTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEME_META }}>
      {children}
    </ThemeContext.Provider>
  );
};
