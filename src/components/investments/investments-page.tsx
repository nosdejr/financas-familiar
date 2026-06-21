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
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  DollarSign,
  Calendar,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export function InvestmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data
  const mockInvestments = [
    { 
      id: 1, 
      name: "Tesouro Selic 2029", 
      type: "treasury", 
      amount: 10000, 
      currentValue: 10500, 
      purchaseDate: "2023-01-15",
      institution: "B3"
    },
    { 
      id: 2, 
      name: "CDB Banco Inter", 
      type: "cdb", 
      amount: 15000, 
      currentValue: 15800, 
      purchaseDate: "2023-03-20",
      institution: "Inter"
    },
    { 
      id: 3, 
      name: "Ações PETR4", 
      type: "stocks", 
      amount: 5000, 
      currentValue: 4800, 
      purchaseDate: "2023-06-10",
      institution: "XP Investimentos"
    },
    { 
      id: 4, 
      name: "Fundo Imobiliário HGLG11", 
      type: "funds", 
      amount: 8000, 
      currentValue: 8500, 
      purchaseDate: "2023-08-05",
      institution: "NuInvest"
    },
    { 
      id: 5, 
      name: "Bitcoin", 
      type: "crypto", 
      amount: 2000, 
      currentValue: 2400, 
      purchaseDate: "2023-09-01",
      institution: "Mercado Bitcoin"
    },
  ]

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalProfit = totalCurrentValue - totalInvested
  const totalProfitPercent = (totalProfit / totalInvested) * 100

  const getInvestmentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      treasury: "Tesouro",
      cdb: "CDB",
      stocks: "Ações",
      funds: "Fundos",
      crypto: "Criptomoedas",
    }
    return labels[type] || type
  }

  const getInvestmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      treasury: "#10B981",
      cdb: "#3B82F6",
      stocks: "#F97316",
      funds: "#8B5CF6",
      crypto: "#EC4899",
    }
    return colors[type] || "#6B7280"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Investimentos</h1>
          <p className="text-muted-foreground">Acompanhe seu portfólio de investimentos</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Investimento
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCurrentValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lucro/Prejuízo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </p>
            <p className={`text-sm ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockInvestments.map((investment) => {
          const profit = investment.currentValue - investment.amount
          const profitPercent = (profit / investment.amount) * 100
          
          return (
            <Card key={investment.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: getInvestmentTypeColor(investment.type) }}
                    >
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{investment.name}</CardTitle>
                      <Badge 
                        variant="outline"
                        className="mt-1"
                        style={{ 
                          borderColor: getInvestmentTypeColor(investment.type),
                          color: getInvestmentTypeColor(investment.type)
                        }}
                      >
                        {getInvestmentTypeLabel(investment.type)}
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Investido
                    </p>
                    <p className="font-semibold text-lg">{formatCurrency(investment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Atual
                    </p>
                    <p className="font-semibold text-lg">{formatCurrency(investment.currentValue)}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  profit >= 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                }`}>
                  {profit >= 0 ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                  <div>
                    <p className="font-bold text-lg">
                      {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                    </p>
                    <p className="text-sm">
                      {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Instituição
                    </span>
                    <span className="font-medium">{investment.institution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Data compra
                    </span>
                    <span className="font-medium">{formatDate(investment.purchaseDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* New Investment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Investimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Investimento</Label>
              <Input placeholder="Ex: Tesouro Selic 2029" />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select>
                <option value="treasury">Tesouro</option>
                <option value="cdb">CDB</option>
                <option value="stocks">Ações</option>
                <option value="funds">Fundos</option>
                <option value="crypto">Criptomoedas</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor Investido</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Valor Atual</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Data da Compra</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Instituição</Label>
              <Input placeholder="Ex: B3, Inter, XP" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Criar Investimento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
