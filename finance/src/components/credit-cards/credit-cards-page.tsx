"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  TrendingUp
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function CreditCardsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data
  const mockCards = [
    { 
      id: 1, 
      name: "Nubank", 
      limit: 10000, 
      used: 3500, 
      bestDay: 10, 
      dueDay: 10,
      color: "#8B5CF6",
      lastFourDigits: "4532"
    },
    { 
      id: 2, 
      name: "Itau", 
      limit: 15000, 
      used: 5200, 
      bestDay: 5, 
      dueDay: 15,
      color: "#F97316",
      lastFourDigits: "7891"
    },
    { 
      id: 3, 
      name: "Inter", 
      limit: 8000, 
      used: 1200, 
      bestDay: 15, 
      dueDay: 5,
      color: "#F97316",
      lastFourDigits: "2345"
    },
  ]

  const totalLimit = mockCards.reduce((sum, card) => sum + card.limit, 0)
  const totalUsed = mockCards.reduce((sum, card) => sum + card.used, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cartões de Crédito</h1>
          <p className="text-muted-foreground">Gerencie seus cartões e faturas</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cartão
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Limite Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalLimit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fatura Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalUsed)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalLimit - totalUsed)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCards.map((card) => {
          const usedPercent = (card.used / card.limit) * 100
          const available = card.limit - card.used
          
          return (
            <div key={card.id}>
              {/* Credit Card Visual */}
              <div 
                className="p-6 rounded-2xl text-white shadow-xl mb-4 relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}99 100%)` 
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <CreditCard className="w-8 h-8 opacity-80" />
                    <span className="text-sm opacity-80">**** {card.lastFourDigits}</span>
                  </div>
                  
                  <p className="text-2xl font-bold mb-1">{card.name}</p>
                  <p className="text-sm opacity-80 mb-6">Cartão de Crédito</p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80">Fatura Atual</p>
                      <p className="text-xl font-bold">{formatCurrency(card.used)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80">Limite</p>
                      <p className="text-lg font-semibold">{formatCurrency(card.limit)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Utilização</span>
                        <span className="font-semibold">{usedPercent.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${usedPercent}%`,
                            backgroundColor: card.color 
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Melhor dia compra
                        </p>
                        <p className="font-semibold">Dia {card.bestDay}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Vencimento
                        </p>
                        <p className="font-semibold">Dia {card.dueDay}</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-muted-foreground">Disponível</span>
                      <span className="font-semibold text-green-600">{formatCurrency(available)}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* New Card Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Cartão de Crédito</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Cartão</Label>
              <Input placeholder="Ex: Nubank" />
            </div>
            <div className="space-y-2">
              <Label>Limite</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Melhor Dia de Compra</Label>
              <Input type="number" min="1" max="31" placeholder="1-31" />
            </div>
            <div className="space-y-2">
              <Label>Dia de Vencimento</Label>
              <Input type="number" min="1" max="31" placeholder="1-31" />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2">
                {["#8B5CF6", "#F97316", "#10B981", "#6B7280", "#EC4899", "#3B82F6"].map((color) => (
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
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Criar Cartão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
