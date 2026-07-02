"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("coisa-admin-theme") as "dark" | "light" | null;
    const nextTheme = storedTheme || "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("coisa-admin-theme", nextTheme);
  }

  return (
    <button onClick={toggleTheme} className="flex items-center gap-2 rounded-full border border-[var(--admin-border)] bg-[var(--admin-panel)] px-3 py-2 text-sm text-[var(--admin-text)] transition hover:border-cyan-400 hover:text-cyan-500">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
