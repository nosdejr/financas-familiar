"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useTransactions } from "@/hooks/use-transactions"
import { useFamilies } from "@/hooks/use-families"

export default function TransactionsPage() {
  const { currentFamily } = useFamilies()
  const { transactions, loading, createTransaction, deleteTransaction, getTotalIncome, getTotalExpenses } = useTransactions(currentFamily?.id)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTransaction({
        amount: parseFloat(formData.amount),
        description: formData.description,
        type: formData.type,
        date: formData.date
      } as any)
      setShowForm(false)
      setFormData({
        amount: "",
        description: "",
        type: "expense",
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error("Error creating transaction:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id)
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const income = getTotalIncome()
  const expenses = getTotalExpenses()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transações</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                {formatCurrency(income)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5" />
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
                {formatCurrency(income - expenses)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nova Transação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" })}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="income">Receita</option>
                      <option value="expense">Despesa</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Salvar</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhuma transação encontrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
