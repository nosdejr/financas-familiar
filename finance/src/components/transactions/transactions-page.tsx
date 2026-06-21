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
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter,
  Plus,
  Calendar,
  Wallet,
  Tag
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const mockTransactions = [
    { id: 1, description: "Salário", amount: 8500.00, type: "income", category: "Salário", account: "Nubank", date: "2024-01-15" },
    { id: 2, description: "Supermercado Extra", amount: 450.00, type: "expense", category: "Alimentação", account: "Nubank", date: "2024-01-14" },
    { id: 3, description: "Netflix", amount: 55.90, type: "expense", category: "Lazer", account: "Itau", date: "2024-01-13" },
    { id: 4, description: "Freelance - Design", amount: 4000.00, type: "income", category: "Freelance", account: "Nubank", date: "2024-01-12" },
    { id: 5, description: "Uber", amount: 35.00, type: "expense", category: "Transporte", account: "Nubank", date: "2024-01-11" },
    { id: 6, description: "Farmácia", amount: 89.90, type: "expense", category: "Saúde", account: "Itau", date: "2024-01-10" },
    { id: 7, description: "Curso Online", amount: 297.00, type: "expense", category: "Educação", account: "Nubank", date: "2024-01-09" },
    { id: 8, description: "Aluguel", amount: 2500.00, type: "expense", category: "Moradia", account: "Itau", date: "2024-01-08" },
    { id: 9, description: "Investimento CDB", amount: 500.00, type: "income", category: "Investimentos", account: "Inter", date: "2024-01-07" },
    { id: 10, description: "Restaurante", amount: 120.00, type: "expense", category: "Alimentação", account: "Nubank", date: "2024-01-06" },
  ]

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesFilter = filterType === "all" || t.type === filterType
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalIncome = mockTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = mockTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalIncome - totalExpense)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar transações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-6 h-6" />
                    ) : (
                      <ArrowDownRight className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {transaction.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Wallet className="w-3 h-3" />
                        {transaction.account}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input placeholder="Ex: Supermercado" />
            </div>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input type="number" placeholder="0,00" />
            </div>
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
                <option value="salario">Salário</option>
                <option value="freelance">Freelance</option>
                <option value="investimentos">Investimentos</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Conta</Label>
              <Select>
                <option value="">Selecione uma conta</option>
                <option value="nubank">Nubank</option>
                <option value="itau">Itau</option>
                <option value="inter">Inter</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
