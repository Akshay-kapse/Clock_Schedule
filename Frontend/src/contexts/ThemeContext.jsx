import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children, applyTheme = true }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("clockScheduleTheme") || "dark";
    }
    return "dark";
  });

  // Update localStorage + html attribute only if applyTheme = true
  useEffect(() => {
    if (!applyTheme) {
      document.documentElement.removeAttribute("data-theme");
      return;
    }
    localStorage.setItem("clockScheduleTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, applyTheme]);

  // Theme classes
  const getThemeClasses = () => {
    if (!applyTheme) {
      // neutral style for login/register etc.
      return {
        bg: "bg-white",
        bgSecondary: "bg-white",
        text: "text-black",
        textSecondary: "text-gray-600",
        card: "bg-white border border-gray-200",
        cardHover: "",
        accent: "text-blue-600",
        button: "bg-blue-500 text-white",
        buttonHover: "hover:bg-blue-600",
        border: "border-gray-200",
        glass: "bg-white",
        navbar: "bg-white shadow",
        navbarScrolled: "bg-white shadow-md",
      };
    }

    switch (theme) {
      case "light":
        return {
          bg: "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100",
          bgSecondary: "bg-white/90",
          text: "text-gray-900",
          textSecondary: "text-gray-900",
          card: "bg-white/80 backdrop-blur-md border-gray-200/30",
          cardHover: "hover:bg-white/90",
          accent: "text-blue-600",
          button: "bg-gradient-to-r from-blue-500 to-purple-600",
          buttonHover: "hover:from-blue-600 hover:to-purple-700",
          border: "border-gray-200/30",
          glass: "bg-white/80 backdrop-blur-md border-gray-200/30",
          navbar: "bg-white/95 backdrop-blur-sm shadow-md",
          navbarScrolled:
            "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/20",
        };
      case "purple":
        return {
          bg: "bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900",
          bgSecondary: "bg-purple-800/20",
          text: "text-purple-100",
          textSecondary: "text-purple-300",
          card: "bg-purple-800/20 backdrop-blur-md border-purple-500/30",
          cardHover: "hover:bg-purple-800/30",
          accent: "text-purple-300",
          button: "bg-gradient-to-r from-purple-500 to-pink-500",
          buttonHover: "hover:from-purple-600 hover:to-pink-600",
          border: "border-purple-500/30",
          glass: "bg-purple-800/20 backdrop-blur-md border-purple-500/30",
          navbar: "bg-purple-900/95 backdrop-blur-sm shadow-md",
          navbarScrolled:
            "bg-purple-900/90 backdrop-blur-md shadow-lg border-b border-purple-500/20",
        };
      default: // dark
        return {
          bg: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
          bgSecondary: "bg-white/10",
          text: "text-white",
          textSecondary: "text-gray-300",
          card: "bg-white/10 backdrop-blur-md border-white/20",
          cardHover: "hover:bg-white/20",
          accent: "text-purple-300",
          button: "bg-gradient-to-r from-purple-500 to-blue-500",
          buttonHover: "hover:from-purple-600 hover:to-blue-600",
          border: "border-white/20",
          glass: "bg-white/10 backdrop-blur-md border-white/20",
          navbar: "bg-white/10 backdrop-blur-sm shadow-md",
          navbarScrolled:
            "bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20",
        };
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, themeClasses: getThemeClasses() }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
