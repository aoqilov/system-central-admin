import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) ?? 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggle() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

// ─── Ishlatish ────────────────────────────────────────────────────────────────

// ✅ 1. Mavjud temani o'qish
// import { useTheme } from "../context/ThemeContext"
//
// function MyComponent() {
//   const { theme } = useTheme()
//   return <p>Hozirgi tema: {theme}</p>   // "dark" | "light"
// }

// ✅ 2. Tema almashtirgich tugma
// import { useTheme } from "../context/ThemeContext"
// import { LuSun, LuMoon } from "react-icons/lu"
//
// function ThemeToggle() {
//   const { theme, toggle } = useTheme()
//   return (
//     <button onClick={toggle}>
//       {theme === "dark" ? <LuSun size={18} /> : <LuMoon size={18} />}
//     </button>
//   )
// }

// ✅ 3. Temaga qarab shartli stil
// import { useTheme } from "../context/ThemeContext"
//
// function Card() {
//   const { theme } = useTheme()
//   return (
//     <div style={{
//       background: theme === "dark" ? "#141720" : "#ffffff",
//       color:      theme === "dark" ? "#f1f5f9" : "#0f172a",
//     }}>
//       Karta
//     </div>
//   )
// }

// ✅ 4. CSS variable orqali (tavsiya etiladi — useTheme shart emas)
//
// function Card() {
//   return (
//     <div style={{ background: "var(--bg-second)", color: "var(--text-default)" }}>
//       Karta — tema o'zgarganda avtomatik yangilanadi
//     </div>
//   )
// }
