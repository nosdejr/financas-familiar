"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, LogOut, User, Users } from "lucide-react"
import { useFamilies } from "@/hooks/use-families"
import { supabase } from "@/lib/supabase"

export default function SettingsPage() {
  const { currentFamily, families, createFamily } = useFamilies()
  const [showFamilyForm, setShowFamilyForm] = useState(false)
  const [familyName, setFamilyName] = useState("")

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createFamily(familyName)
      setShowFamilyForm(false)
      setFamilyName("")
    } catch (error) {
      console.error("Error creating family:", error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Configurações
        </h1>

        {/* Family Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Família
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Família Atual</Label>
                <p className="text-lg font-medium mt-1">
                  {currentFamily?.name || "Nenhuma família selecionada"}
                </p>
              </div>
              

              {!showFamilyForm ? (
                <Button onClick={() => setShowFamilyForm(true)} variant="outline">
                  Criar Nova Família
                </Button>
              ) : (
                <form onSubmit={handleCreateFamily} className="space-y-2">
                  <Input
                    placeholder="Nome da família"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Criar</Button>
                    <Button type="button" variant="outline" onClick={() => setShowFamilyForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleSignOut} variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Finanças Familiar - Sistema de gestão financeira familiar
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Versão 1.0.0
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
