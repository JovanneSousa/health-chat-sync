import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMetrics } from '@/hooks/useMetrics';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { MessageCircle, Users, Clock, CheckCircle, LogOut, AlertCircle } from 'lucide-react';

export function AttendantDashboard() {
  const { user, logout } = useAuth();
  const { metrics, isLoading } = useMetrics();

  const stats = [
    { label: 'Conversas Ativas', value: metrics.activeConversations.toString(), icon: MessageCircle, color: 'bg-primary' },
    { label: 'Resolvidas Hoje', value: metrics.resolvedToday.toString(), icon: CheckCircle, color: 'bg-success' },
    { label: 'Tempo Médio Resposta', value: `${metrics.avgResponseTimeMinutes}min`, icon: Clock, color: 'bg-warning' },
    { label: 'Pendentes', value: metrics.pendingConversations.toString(), icon: AlertCircle, color: 'bg-secondary' }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Conversations Sidebar */}
      <ConversationSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-card border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{user?.avatar}</div>
                <div>
                  <h1 className="text-lg font-semibold">Olá, {user?.name}</h1>
                  <p className="text-sm text-muted-foreground">Painel do Atendente</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  Online
                </Badge>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">
                        {isLoading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color} text-white`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Conversations */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Conversas Prioritárias</CardTitle>
              <CardDescription>
                Conversas que precisam de atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <div>
                      <p className="font-medium">Maria Santos</p>
                      <p className="text-sm text-muted-foreground">Dor no peito - Urgente</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Urgente</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-warning/20 bg-warning/5">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-warning" />
                    <div>
                      <p className="font-medium">João Silva</p>
                      <p className="text-sm text-muted-foreground">Reagendamento de consulta</p>
                    </div>
                  </div>
                  <Badge variant="outline">Pendente</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Ana Costa</p>
                      <p className="text-sm text-muted-foreground">Resultado de exame</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Ferramentas para otimizar seu atendimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Iniciar Nova Conversa
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Buscar Paciente
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Verificar Agenda
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2" />
                Relatório Diário
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <div className="mt-8">
          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-secondary">Suas Permissões</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>✓ Responder conversas de pacientes</li>
                <li>✓ Acessar histórico de conversas</li>
                <li>✓ Agendar consultas para pacientes</li>
                <li>✓ Registrar informações relevantes</li>
                <li>✓ Usar respostas rápidas</li>
                <li>✓ Visualizar agenda médica</li>
              </ul>
            </CardContent>
          </Card>
          </div>
        </main>
      </div>
    </div>
  );
}