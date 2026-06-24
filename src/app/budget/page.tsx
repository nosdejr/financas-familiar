"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Plus, Trash2, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useBudgets } from "@/hooks/use-budgets"
import { useFamilies } from "@/hooks/use-families"
import { AppLayout } from "@/components/layout/app-layout"

export default function BudgetPage() {
  const { currentFamily } = useFamilies()
  const { budgets, loading, createBudget, deleteBudget } = useBudgets(currentFamily?.id)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly" as "monthly" | "yearly"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createBudget({
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: formData.period
      } as any)
      setShowForm(false)
      setFormData({
        category: "",
        limit: "",
        period: "monthly"
      })
    } catch (error) {
      console.error("Error creating budget:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id)
    } catch (error) {
      console.error("Error deleting budget:", error)
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Orçamento</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Novo Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="limit">Limite</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="period">Período</Label>
                  <select
                    id="period"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Salvar</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Budgets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets && budgets.length > 0 ? (
            budgets.map((budget: any) => (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {budget.category}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Limite</span>
                      <span className="font-bold">{formatCurrency(budget.limit)}</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Período: {budget.period === 'monthly' ? 'Mensal' : 'Anual'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center text-slate-500">
                Nenhum orçamento encontrado
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
