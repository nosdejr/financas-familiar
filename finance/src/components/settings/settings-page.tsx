"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Bell, 
  Shield,
  CreditCard,
  Moon,
  Sun,
  Users,
  LogOut
} from "lucide-react"

export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e conta</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">João Silva</h3>
              <p className="text-muted-foreground">joao.silva@email.com</p>
              <Badge variant="outline" className="mt-1">Administrador</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input defaultValue="João Silva" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="joao.silva@email.com" type="email" />
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Family Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Família
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da Família</Label>
            <Input defaultValue="Família Silva" />
          </div>
          <div className="space-y-3">
            <Label>Membros</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-muted-foreground">Administrador</p>
                  </div>
                </div>
                <Badge>Admin</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
                      MS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Maria Silva</p>
                    <p className="text-sm text-muted-foreground">Cônjuge</p>
                  </div>
                </div>
                <Badge variant="outline">Cônjuge</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Convidar Membro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Preferências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações</Label>
              <p className="text-sm text-muted-foreground">Receber alertas sobre contas e metas</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Senha Atual</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Nova Senha</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Confirmar Nova Senha</Label>
            <Input type="password" />
          </div>
          <Button variant="outline">
            Atualizar Senha
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Plano Premium</h3>
                <p className="text-blue-100">Acesso a todos os recursos</p>
              </div>
              <Badge className="bg-white text-blue-600">Ativo</Badge>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Relatórios ilimitados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Insights inteligentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Membros ilimitados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Exportação PDF/Excel</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Gerenciar Assinatura
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <LogOut className="w-5 h-5" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
            Sair da Conta
          </Button>
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
            Excluir Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
