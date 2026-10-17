import { createContext, useCallback, useContext, useLayoutEffect } from "react";
import { flushSync } from "react-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

// First visit: follow the operating system. After that: the saved choice.
const systemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("aethercareTheme", systemTheme());

  // Keep <html data-theme="..."> in step with the state (the CSS reads it).
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(
    (event) => {
      const next = theme === "dark" ? "light" : "dark";
      const root = document.documentElement;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const apply = () => {
        root.dataset.theme = next;
        flushSync(() => setTheme(next));
      };

      // Browsers without the View Transitions API: fade the colours instead.
      if (!document.startViewTransition || reduceMotion) {
        if (!reduceMotion) {
          root.classList.add("theme-fade");
          window.setTimeout(() => root.classList.remove("theme-fade"), 600);
        }
        apply();
        return;
      }

      // The new theme blooms outward from the button that was pressed.
      const rect = event?.currentTarget?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(apply);

      transition.ready.then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 950,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });
    },
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
