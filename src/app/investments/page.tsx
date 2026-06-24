"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Plus, Trash2, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useInvestments } from "@/hooks/use-investments"
import { useFamilies } from "@/hooks/use-families"
import { AppLayout } from "@/components/layout/app-layout"

export default function InvestmentsPage() {
  const { currentFamily } = useFamilies()
  const { investments, loading, createInvestment, deleteInvestment } = useInvestments(currentFamily?.id)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "stocks" as "stocks" | "crypto" | "real_estate" | "bonds" | "other",
    amount: "",
    current_value: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createInvestment({
        name: formData.name,
        type: formData.type,
        amount: parseFloat(formData.amount),
        current_value: parseFloat(formData.current_value) || parseFloat(formData.amount)
      } as any)
      setShowForm(false)
      setFormData({
        name: "",
        type: "stocks",
        amount: "",
        current_value: ""
      })
    } catch (error) {
      console.error("Error creating investment:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestment(id)
    } catch (error) {
      console.error("Error deleting investment:", error)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AppLayout>
    )
  }

  const totalValue = investments?.reduce((sum: number, inv: any) => sum + (inv.current_value || 0), 0) || 0

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Investimentos</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Investimento
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              {formatCurrency(totalValue)}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Novo Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="stocks">Ações</option>
                    <option value="crypto">Cripto</option>
                    <option value="real_estate">Imóveis</option>
                    <option value="bonds">Títulos</option>
                    <option value="other">Outros</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">Valor Investido</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="current_value">Valor Atual (opcional)</Label>
                  <Input
                    id="current_value"
                    type="number"
                    step="0.01"
                    value={formData.current_value}
                    onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
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

        {/* Investments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investments && investments.length > 0 ? (
            investments.map((investment: any) => {
              const profit = investment.current_value - investment.amount
              const profitPercent = investment.amount > 0 ? (profit / investment.amount) * 100 : 0
              return (
                <Card key={investment.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {investment.name}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(investment.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Valor Atual</span>
                        <span className="font-bold">{formatCurrency(investment.current_value)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Investido</span>
                        <span className="font-medium">{formatCurrency(investment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Lucro/Prejuízo</span>
                        <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Rentabilidade</span>
                        <span className={`font-medium ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitPercent.toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{investment.type}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center text-slate-500">
                Nenhum investimento encontrado
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
