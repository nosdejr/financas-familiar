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
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function AccountsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data
  const mockAccounts = [
    { id: 1, name: "Nubank", type: "checking", balance: 15230.50, color: "#8B5CF6", icon: "wallet" },
    { id: 2, name: "Itau", type: "checking", balance: 8500.00, color: "#F97316", icon: "wallet" },
    { id: 3, name: "Poupança Inter", type: "savings", balance: 25000.00, color: "#10B981", icon: "piggy-bank" },
    { id: 4, name: "Dinheiro", type: "cash", balance: 500.00, color: "#6B7280", icon: "banknote" },
    { id: 5, name: "Carteira", type: "wallet", balance: 200.00, color: "#EC4899", icon: "wallet" },
  ]

  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0)

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      checking: "Conta Corrente",
      savings: "Poupança",
      cash: "Dinheiro",
      wallet: "Carteira",
      digital: "Conta Digital",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contas</h1>
          <p className="text-muted-foreground">Gerencie suas contas bancárias</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-100">Saldo Total Consolidado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
          <div className="flex items-center gap-2 mt-2 text-blue-100">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+12.5% em relação ao mês anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAccounts.map((account) => (
          <Card key={account.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: account.color }}
                  >
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">{getAccountTypeLabel(account.type)}</Badge>
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
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Entradas: {formatCurrency(account.balance * 1.2)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Saídas: {formatCurrency(account.balance * 0.8)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Conta</Label>
              <Input placeholder="Ex: Nubank" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <Select>
                <option value="checking">Conta Corrente</option>
                <option value="savings">Poupança</option>
                <option value="cash">Dinheiro</option>
                <option value="wallet">Carteira</option>
                <option value="digital">Conta Digital</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Saldo Inicial</Label>
              <Input type="number" placeholder="0,00" />
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
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Criar Conta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
