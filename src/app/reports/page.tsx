"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, BarChart3, Download, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useTransactions } from "@/hooks/use-transactions"
import { useFamilies } from "@/hooks/use-families"
import { AppLayout } from "@/components/layout/app-layout"

export default function ReportsPage() {
  const { currentFamily } = useFamilies()
  const { transactions, loading, getTotalIncome, getTotalExpenses } = useTransactions(currentFamily?.id)

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AppLayout>
    )
  }

  const income = getTotalIncome()
  const expenses = getTotalExpenses()
  const balance = income - expenses

  // Group expenses by description (simplified category)
  const expenseByCategory = transactions?.filter((t: any) => t.type === 'expense').reduce((acc: any, t: any) => {
    const category = t.description || 'Outros'
    acc[category] = (acc[category] || 0) + t.amount
    return acc
  }, {}) || {}

  const categoryData = Object.entries(expenseByCategory).map(([name, amount]) => ({
    name,
    amount: amount as number,
    percentage: expenses > 0 ? ((amount as number) / expenses) * 100 : 0
  }))

  const handleExport = () => {
    if (!transactions || transactions.length === 0) return

    const csv = [
      ['Data', 'Descrição', 'Tipo', 'Valor'],
      ...transactions.map((t: any) => [
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.description,
        t.type === 'income' ? 'Receita' : 'Despesa',
        t.amount.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Relatórios</h1>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Receitas Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(income)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Despesas Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(expenses)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(balance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cat.name}</span>
                      <span>{formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhuma despesa registrada</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Histórico de Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.slice(0, 10).map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhuma transação encontrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
