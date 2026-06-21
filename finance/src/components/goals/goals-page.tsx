"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export function GoalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data
  const mockGoals = [
    { id: 1, name: "Viagem Europa", target: 30000, current: 15000, targetDate: "2024-12-01", icon: "✈️", color: "#3B82F6", status: "active" },
    { id: 2, name: "Reserva de Emergência", target: 50000, current: 35000, targetDate: "2025-06-01", icon: "🏦", color: "#10B981", status: "active" },
    { id: 3, name: "Carro Novo", target: 80000, current: 25000, targetDate: "2026-01-01", icon: "🚗", color: "#F97316", status: "active" },
    { id: 4, name: "Casa Própria", target: 300000, current: 50000, targetDate: "2030-01-01", icon: "🏠", color: "#8B5CF6", status: "active" },
    { id: 5, name: "Curso MBA", target: 15000, current: 15000, targetDate: "2024-03-01", icon: "📚", color: "#EC4899", status: "completed" },
  ]

  const totalSaved = mockGoals.reduce((sum, goal) => sum + goal.current, 0)
  const totalTarget = mockGoals.reduce((sum, goal) => sum + goal.target, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Metas Financeiras</h1>
          <p className="text-muted-foreground">Acompanhe seus objetivos financeiros</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Economizado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSaved)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total das Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progresso Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{((totalSaved / totalTarget) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockGoals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const remaining = goal.target - goal.current
          
          return (
            <Card key={goal.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      {goal.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <Badge 
                        variant={goal.status === 'completed' ? 'default' : 'outline'}
                        className="mt-1"
                      >
                        {goal.status === 'completed' ? 'Concluída' : 'Em andamento'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: goal.color 
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Economizado
                    </p>
                    <p className="font-semibold text-lg">{formatCurrency(goal.current)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Meta
                    </p>
                    <p className="font-semibold text-lg">{formatCurrency(goal.target)}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Data alvo
                    </span>
                    <span className="font-medium">{formatDate(goal.targetDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Falta</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(remaining)}</span>
                  </div>
                </div>

                {goal.status !== 'completed' && (
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Adicionar Valor
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* New Goal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Meta Financeira</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Meta</Label>
              <Input placeholder="Ex: Viagem Europa" />
            </div>
            <div className="space-y-2">
              <Label>Valor da Meta</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Valor Inicial</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Data Alvo</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="flex gap-2 flex-wrap">
                {["✈️", "🏦", "🚗", "🏠", "📚", "💻", "🎓", "💍", "🏥", "🎮"].map((icon) => (
                  <button
                    key={icon}
                    className="w-10 h-10 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 text-2xl"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2">
                {["#3B82F6", "#10B981", "#F97316", "#8B5CF6", "#EC4899", "#6B7280"].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-slate-400"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Criar Meta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
