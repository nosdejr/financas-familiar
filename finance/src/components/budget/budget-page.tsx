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
  Wallet, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import { formatCurrency, formatPercent } from "@/lib/utils"

export function BudgetPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data
  const mockBudgets = [
    { id: 1, category: "Alimentação", budget: 2000, spent: 1850, icon: "🍔", color: "#F97316" },
    { id: 2, category: "Transporte", budget: 800, spent: 650, icon: "🚗", color: "#3B82F6" },
    { id: 3, category: "Moradia", budget: 3000, spent: 2800, icon: "🏠", color: "#10B981" },
    { id: 4, category: "Saúde", budget: 500, spent: 200, icon: "💊", color: "#EC4899" },
    { id: 5, category: "Educação", budget: 1000, spent: 950, icon: "📚", color: "#8B5CF6" },
    { id: 6, category: "Lazer", budget: 1500, spent: 1700, icon: "🎮", color: "#6B7280" },
  ]

  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.budget, 0)
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalBudget - totalSpent

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orçamento Mensal</h1>
          <p className="text-muted-foreground">Janeiro 2024</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orçamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gasto Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Utilização do Orçamento</span>
              <span className="font-semibold">{formatPercent((totalSpent / totalBudget) * 100)}</span>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${totalSpent > totalBudget ? 'bg-red-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockBudgets.map((budget) => {
          const percent = (budget.spent / budget.budget) * 100
          const isOverBudget = budget.spent > budget.budget
          const remaining = budget.budget - budget.spent
          
          return (
            <Card key={budget.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${budget.color}20` }}
                    >
                      {budget.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                      <Badge 
                        variant={isOverBudget ? 'destructive' : percent > 80 ? 'default' : 'outline'}
                        className="mt-1"
                      >
                        {isOverBudget ? 'Excedido' : percent > 80 ? 'Atenção' : 'OK'}
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
                    <span className={`font-semibold ${isOverBudget ? 'text-red-600' : ''}`}>
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-red-500' : ''}`}
                      style={{ 
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: isOverBudget ? undefined : budget.color 
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      Orçamento
                    </p>
                    <p className="font-semibold text-lg">{formatCurrency(budget.budget)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Gasto
                    </p>
                    <p className={`font-semibold text-lg ${isOverBudget ? 'text-red-600' : ''}`}>
                      {formatCurrency(budget.spent)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Restante</span>
                    <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>

                {isOverBudget && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Você excedeu o orçamento em {formatCurrency(Math.abs(remaining))}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* New Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Orçamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select>
                <option value="">Selecione uma categoria</option>
                <option value="alimentacao">Alimentação</option>
                <option value="transporte">Transporte</option>
                <option value="moradia">Moradia</option>
                <option value="saude">Saúde</option>
                <option value="educacao">Educação</option>
                <option value="lazer">Lazer</option>
                <option value="outros">Outros</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor do Orçamento</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Mês</Label>
              <Select>
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Criar Orçamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
