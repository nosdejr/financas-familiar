"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Plus, Trash2, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useCreditCards } from "@/hooks/use-credit-cards"
import { useFamilies } from "@/hooks/use-families"
import { AppLayout } from "@/components/layout/app-layout"

export default function CreditCardsPage() {
  const { currentFamily } = useFamilies()
  const { creditCards, loading, createCreditCard, deleteCreditCard } = useCreditCards(currentFamily?.id)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    last_four_digits: "",
    limit: "",
    due_day: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createCreditCard({
        name: formData.name,
        last_four_digits: formData.last_four_digits,
        limit: parseFloat(formData.limit),
        due_day: parseInt(formData.due_day)
      } as any)
      setShowForm(false)
      setFormData({
        name: "",
        last_four_digits: "",
        limit: "",
        due_day: ""
      })
    } catch (error) {
      console.error("Error creating credit card:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCreditCard(id)
    } catch (error) {
      console.error("Error deleting credit card:", error)
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cartões de Crédito</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cartão
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Novo Cartão</CardTitle>
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
                  <Label htmlFor="last_four_digits">Últimos 4 Dígitos</Label>
                  <Input
                    id="last_four_digits"
                    value={formData.last_four_digits}
                    onChange={(e) => setFormData({ ...formData, last_four_digits: e.target.value })}
                    maxLength={4}
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
                  <Label htmlFor="due_day">Dia de Vencimento</Label>
                  <Input
                    id="due_day"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.due_day}
                    onChange={(e) => setFormData({ ...formData, due_day: e.target.value })}
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

        {/* Credit Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditCards && creditCards.length > 0 ? (
            creditCards.map((card: any) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      {card.name}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(card.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">**** {card.last_four_digits}</span>
                      <span className="font-bold">{formatCurrency(card.limit)}</span>
                    </div>
                    <p className="text-sm text-slate-500">Vencimento: dia {card.due_day}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center text-slate-500">
                Nenhum cartão encontrado
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
