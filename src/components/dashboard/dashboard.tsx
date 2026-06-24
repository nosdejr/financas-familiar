"use client"

import { useState, useEffect } from "react"
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
  Loader2
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useFamilies } from "@/hooks/use-families"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions } from "@/hooks/use-transactions"
import { useGoals } from "@/hooks/use-goals"
import { useCreditCards } from "@/hooks/use-credit-cards"
import { useAuth } from "@/lib/auth"
import { AppLayout } from "@/components/layout/app-layout"

export function Dashboard() {
  const router = useRouter()
  const { getUser } = useAuth()
  const { currentFamily, loading: familyLoading, createFamily } = useFamilies()
  const { accounts, loading: accountsLoading, getTotalBalance } = useAccounts(currentFamily?.id)
  const { transactions, loading: transactionsLoading, getTotalIncome, getTotalExpenses } = useTransactions(currentFamily?.id)
  const { goals, loading: goalsLoading, getProgress } = useGoals(currentFamily?.id)
  const { creditCards, loading: creditCardsLoading } = useCreditCards(currentFamily?.id)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
    checkAuth()
  }, [])

  if (familyLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AppLayout>
    )
  }

  if (!currentFamily) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center p-4 min-h-[50vh]">
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
      </AppLayout>
    )
  }

  const totalBalance = getTotalBalance()
  const income = getTotalIncome()
  const expenses = getTotalExpenses()
  const savings = income - expenses

  return (
    <AppLayout>

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
          <Button onClick={() => router.push('/transactions')} className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
          <Button onClick={() => router.push('/transactions')} className="flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
          <Button onClick={() => router.push('/accounts')} className="flex-shrink-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Transferência
          </Button>
          <Button onClick={() => router.push('/goals')} className="flex-shrink-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow">
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

    </AppLayout>
  )
}
