"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  ArrowUpRight,
  Wallet,
  CreditCard,
  Target,
  BarChart3,
  TrendingUp,
  Settings,
  Moon,
  Sun
} from "lucide-react"
import { useFamilies } from "@/hooks/use-families"
import { useAuth } from "@/lib/auth"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { getUser } = useAuth()
  const { currentFamily } = useFamilies()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getUser()
      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
      }
    } catch (error) {
      router.push("/login")
    }
  }

  if (!mounted) {
    return null
  }

  const navItems = [
    { icon: PieChart, label: "Dashboard", href: "/" },
    { icon: ArrowUpRight, label: "Transações", href: "/transactions" },
    { icon: Wallet, label: "Contas", href: "/accounts" },
    { icon: CreditCard, label: "Cartões", href: "/credit-cards" },
    { icon: Target, label: "Metas", href: "/goals" },
    { icon: BarChart3, label: "Orçamento", href: "/budget" },
    { icon: TrendingUp, label: "Investimentos", href: "/investments" },
    { icon: PieChart, label: "Relatórios", href: "/reports" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ]

  const mobileNavItems = [
    { icon: PieChart, label: "Início", href: "/" },
    { icon: ArrowUpRight, label: "Transações", href: "/transactions" },
    { icon: CreditCard, label: "Cartões", href: "/credit-cards" },
    { icon: Target, label: "Metas", href: "/goals" },
    { icon: Settings, label: "Config", href: "/settings" },
  ]

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'JD'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FinanceFlow
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === item.href
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full justify-start gap-3"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </Button>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-20 lg:pb-8">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FinanceFlow
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {getUserInitials()}
              </div>
            </Button>
          </div>
        </div>

        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2">
        <div className="flex justify-around">
          {mobileNavItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                pathname === item.href
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
