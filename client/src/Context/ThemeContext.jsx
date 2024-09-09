import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("light-theme");

  useEffect(() => {
    const storedTheme = localStorage.getItem("themeName");
    if (storedTheme) {
      setThemeName(storedTheme);
    }
  }, []);

  const toggleTheme = (theme) => {
    if (theme === "light-theme") {
      localStorage.setItem("themeName", "light-theme");
      setThemeName("light-theme");
    } else if (theme === "dark-theme") {
      localStorage.setItem("themeName", "dark-theme");
      setThemeName("dark-theme");
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("themeName");
    if (storedTheme) {
      setThemeName(storedTheme);
    } else {
      localStorage.setItem("themeName", themeName);
    }
  }, []);

  useEffect(() => {
    if (themeName === "dark-theme") {
      document.documentElement.style.setProperty("color-scheme", "dark");
    } else {
      document.documentElement.style.setProperty("color-scheme", "light");
    }
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
