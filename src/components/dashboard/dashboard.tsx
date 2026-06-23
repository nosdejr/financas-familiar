"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CreditCard,
  Target,
  PieChart,
  BarChart3,
  Moon,
  Sun,
  Loader2,
  Settings
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useFamilies } from "@/hooks/use-families"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions } from "@/hooks/use-transactions"
import { useGoals } from "@/hooks/use-goals"
import { useCreditCards } from "@/hooks/use-credit-cards"
import { useAuth } from "@/lib/auth"

export function Dashboard() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { getUser } = useAuth()
  const { currentFamily, loading: familyLoading, createFamily } = useFamilies()
  const { accounts, loading: accountsLoading, getTotalBalance } = useAccounts(currentFamily?.id)
  const { transactions, loading: transactionsLoading, getTotalIncome, getTotalExpenses } = useTransactions(currentFamily?.id)
  const { goals, loading: goalsLoading, getProgress } = useGoals(currentFamily?.id)
  const { creditCards, loading: creditCardsLoading } = useCreditCards(currentFamily?.id)
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

  // Only show loading for family loading, other hooks can load in background
  if (familyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!currentFamily) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bem-vindo ao FinanceFlow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Você ainda não tem uma família configurada. Crie uma para começar a controlar suas finanças.
            </p>
            <Button className="w-full" onClick={async () => {
              try {
                const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'
                const familyName = `Família de ${fullName}`
                await createFamily(familyName)
              } catch (error) {
                console.error('Error creating family:', error)
              }
            }}>
              Criar Família
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBalance = getTotalBalance()
  const income = getTotalIncome()
  const expenses = getTotalExpenses()
  const savings = income - expenses

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
          {[
            { icon: PieChart, label: "Dashboard", active: true, href: "/" },
            { icon: ArrowUpRight, label: "Transações", active: false, href: "/transactions" },
            { icon: Wallet, label: "Contas", active: false, href: "/accounts" },
            { icon: CreditCard, label: "Cartões", active: false, href: "/credit-cards" },
            { icon: Target, label: "Metas", active: false, href: "/goals" },
            { icon: BarChart3, label: "Orçamento", active: false, href: "/budget" },
            { icon: TrendingUp, label: "Investimentos", active: false, href: "/investments" },
            { icon: PieChart, label: "Relatórios", active: false, href: "/reports" },
            { icon: Settings, label: "Configurações", active: false, href: "/settings" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
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
              JD
            </div>
            <div>
              <p className="font-medium text-sm">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
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
                JD
              </div>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-100">Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold">{formatCurrency(totalBalance)}</span>
                <Wallet className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-100">Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold">{formatCurrency(income)}</span>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-100">Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold">{formatCurrency(expenses)}</span>
                <TrendingDown className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-100">Economia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold">{formatCurrency(savings)}</span>
                <PiggyBank className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <Button className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
          <Button className="flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
          <Button className="flex-shrink-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Transferência
          </Button>
          <Button className="flex-shrink-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow">
            <Target className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transações Recentes</CardTitle>
                <Button variant="ghost" size="sm">Ver todas</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-slate-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-slate-500 py-8">Nenhuma transação encontrada</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Metas Financeiras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal: any) => {
                const progress = getProgress(goal)
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{goal.icon}</span>
                        <span className="font-medium text-sm">{goal.name}</span>
                      </div>
                      <Badge variant="outline">{progress.toFixed(0)}%</Badge>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{formatCurrency(goal.current_amount)}</span>
                      <span>{formatCurrency(goal.target_amount)}</span>
                    </div>
                  </div>
                )
              })}
              {goals.length === 0 && (
                <p className="text-center text-slate-500 py-8">Nenhuma meta encontrada</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Credit Cards */}
        <Card className="mt-6 shadow-xl">
          <CardHeader>
            <CardTitle>Cartões de Crédito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {creditCards.map((card: any) => {
                const usedPercent = 0 // Need to calculate from transactions
                return (
                  <div key={card.id} className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">{card.name}</span>
                      <CreditCard className="w-6 h-6 opacity-80" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Limite</span>
                        <span>{formatCurrency(card.limit)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Vencimento</span>
                        <span>dia {card.due_day}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {creditCards.length === 0 && (
                <p className="text-center text-slate-500 py-8 col-span-2">Nenhum cartão encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2">
          <div className="flex justify-around">
            {[
              { icon: PieChart, label: "Início", active: true, href: "/" },
              { icon: ArrowUpRight, label: "Transações", active: false, href: "/transactions" },
              { icon: CreditCard, label: "Cartões", active: false, href: "/credit-cards" },
              { icon: Target, label: "Metas", active: false, href: "/goals" },
              { icon: Settings, label: "Config", active: false, href: "/settings" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  item.active
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
      </main>
    </div>
  )
}
