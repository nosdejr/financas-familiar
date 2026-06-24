"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Plus, Trash2, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useAccounts } from "@/hooks/use-accounts"
import { useFamilies } from "@/hooks/use-families"
import { AppLayout } from "@/components/layout/app-layout"

export default function AccountsPage() {
  const { currentFamily } = useFamilies()
  const { accounts, loading, createAccount, deleteAccount, getTotalBalance } = useAccounts(currentFamily?.id)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "checking" as "checking" | "savings" | "credit" | "investment",
    balance: "",
    currency: "BRL"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAccount({
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
        currency: formData.currency
      } as any)
      setShowForm(false)
      setFormData({
        name: "",
        type: "checking",
        balance: "",
        currency: "BRL"
      })
    } catch (error) {
      console.error("Error creating account:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id)
    } catch (error) {
      console.error("Error deleting account:", error)
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

  const totalBalance = getTotalBalance()

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contas</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-6 h-6" />
              {formatCurrency(totalBalance)}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nova Conta</CardTitle>
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
                    <option value="checking">Conta Corrente</option>
                    <option value="savings">Poupança</option>
                    <option value="credit">Cartão de Crédito</option>
                    <option value="investment">Investimento</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="balance">Saldo Inicial</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
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

        {/* Accounts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts && accounts.length > 0 ? (
            accounts.map((account: any) => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {account.name}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(account.balance)}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{account.type}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center text-slate-500">
                Nenhuma conta encontrada
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
