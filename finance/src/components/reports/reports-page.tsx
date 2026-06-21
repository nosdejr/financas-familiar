"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function ReportsPage() {
  const [period, setPeriod] = useState("monthly")
  const [year, setYear] = useState("2024")

  // Mock data
  const mockReportData = {
    monthly: {
      income: 12500,
      expenses: 8750,
      balance: 3750,
      byCategory: [
        { category: "Alimentação", amount: 1850, percent: 21.1 },
        { category: "Moradia", amount: 2800, percent: 32.0 },
        { category: "Transporte", amount: 650, percent: 7.4 },
        { category: "Lazer", amount: 1700, percent: 19.4 },
        { category: "Saúde", amount: 200, percent: 2.3 },
        { category: "Educação", amount: 950, percent: 10.9 },
        { category: "Outros", amount: 600, percent: 6.9 },
      ],
      monthlyEvolution: [
        { month: "Ago", income: 11000, expenses: 9000 },
        { month: "Set", income: 12000, expenses: 8500 },
        { month: "Out", income: 11500, expenses: 9200 },
        { month: "Nov", income: 13000, expenses: 8000 },
        { month: "Dez", income: 15000, expenses: 12000 },
        { month: "Jan", income: 12500, expenses: 8750 },
      ]
    }
  }

  const currentData = mockReportData.monthly

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada das suas finanças</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="monthly">Mensal</option>
            <option value="quarterly">Trimestral</option>
            <option value="annual">Anual</option>
          </Select>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(currentData.income)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(currentData.expenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${currentData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(currentData.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentData.byCategory.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{formatCurrency(item.amount)}</span>
                    <Badge variant="outline">{item.percent.toFixed(1)}%</Badge>
                  </div>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Evolution */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentData.monthlyEvolution.map((item) => {
              const balance = item.income - item.expenses
              return (
                <div key={item.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {item.month}
                    </span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600">{formatCurrency(item.income)}</span>
                      <span className="text-red-600">{formatCurrency(item.expenses)}</span>
                      <Badge variant={balance >= 0 ? 'default' : 'destructive'}>
                        {formatCurrency(balance)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 h-2">
                    <div 
                      className="h-full bg-green-500 rounded-l-full transition-all"
                      style={{ width: `${(item.income / (item.income + item.expenses)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-red-500 rounded-r-full transition-all"
                      style={{ width: `${(item.expenses / (item.income + item.expenses)) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
            <TrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">Sua economia aumentou 12% em relação ao mês anterior. Continue assim!</p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
            <PieChart className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">Você gastou 32% do seu orçamento com moradia. Considere revisar esse item.</p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
            <TrendingDown className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">Seus gastos com lazer aumentaram 18% este mês. Fique atento!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
