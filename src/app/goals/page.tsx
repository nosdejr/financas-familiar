"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useGoals } from "@/hooks/use-goals"
import { useFamilies } from "@/hooks/use-families"

export default function GoalsPage() {
  const { currentFamily } = useFamilies()
  const { goals, loading, createGoal, deleteGoal, getProgress } = useGoals(currentFamily?.id)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    current_amount: "",
    target_date: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createGoal({
        name: formData.name,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount) || 0,
        target_date: formData.target_date
      } as any)
      setShowForm(false)
      setFormData({
        name: "",
        target_amount: "",
        current_amount: "",
        target_date: ""
      })
    } catch (error) {
      console.error("Error creating goal:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id)
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Metas Financeiras</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nova Meta</CardTitle>
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
                  <Label htmlFor="target_amount">Valor da Meta</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="current_amount">Valor Atual (opcional)</Label>
                  <Input
                    id="current_amount"
                    type="number"
                    step="0.01"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="target_date">Data Alvo</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
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

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals && goals.length > 0 ? (
            goals.map((goal: any) => {
              const progress = getProgress(goal.id)
              return (
                <Card key={goal.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {goal.name}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Progresso</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Atual</span>
                        <span className="font-medium">{formatCurrency(goal.current_amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Meta</span>
                        <span className="font-bold">{formatCurrency(goal.target_amount)}</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        Data alvo: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center text-slate-500">
                Nenhuma meta encontrada
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
