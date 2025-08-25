import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Users, Settings, Shield, LogOut, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export function ManagerDashboard() {
  const { user, logout } = useAuth();

  const teamStats = [
    { name: 'João Santos', status: 'online', conversations: 12, avgResponse: '2.5min', resolved: 24 },
    { name: 'Maria Oliveira', status: 'online', conversations: 8, avgResponse: '3.1min', resolved: 18 },
    { name: 'Pedro Silva', status: 'away', conversations: 5, avgResponse: '4.2min', resolved: 15 }
  ];

  const metrics = [
    { label: 'Total de Conversas', value: '245', change: '+12%', icon: BarChart3 },
    { label: 'Tempo Médio de Resposta', value: '3.2min', change: '-5%', icon: Clock },
    { label: 'Taxa de Resolução', value: '94%', change: '+2%', icon: CheckCircle },
    { label: 'Satisfação do Cliente', value: '4.8/5', change: '+0.3', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{user?.avatar}</div>
              <div>
                <h1 className="text-lg font-semibold">Olá, {user?.name}</h1>
                <p className="text-sm text-muted-foreground">Painel Gerencial</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.label} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-success">{metric.change}</p>
                  </div>
                  <div className="p-3 rounded-full bg-primary text-white">
                    <metric.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Performance */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Performance da Equipe</CardTitle>
              <CardDescription>
                Status e métricas em tempo real dos atendentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamStats.map((member) => (
                  <div key={member.name} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">👨‍💼</div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              member.status === 'online' ? 'bg-success' : 'bg-warning'
                            }`}></div>
                            <span className="text-sm text-muted-foreground capitalize">
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Conversas</p>
                        <p className="font-medium">{member.conversations}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resp. Média</p>
                        <p className="font-medium">{member.avgResponse}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resolvidas</p>
                        <p className="font-medium">{member.resolved}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Management Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Ações Gerenciais</CardTitle>
              <CardDescription>
                Ferramentas de supervisão e gestão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios Detalhados
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Equipe
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Configurar Filas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Supervisionar Conversas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Atividade Recente do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Nova integração WhatsApp ativada</p>
                    <p className="text-xs text-muted-foreground">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Tempo de resposta acima da meta</p>
                    <p className="text-xs text-muted-foreground">Há 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Relatório mensal gerado</p>
                    <p className="text-xs text-muted-foreground">Ontem</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <div className="mt-8">
          <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30">
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-300">Suas Permissões (Nível Gerencial)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>✓ Todas as permissões de atendente</li>
                <li>✓ Supervisionar conversas em tempo real</li>
                <li>✓ Gerenciar filas de atendimento</li>
                <li>✓ Redistribuir atendimentos</li>
                <li>✓ Acessar relatórios consolidados</li>
                <li>✓ Configurar integrações</li>
                <li>✓ Gerenciar equipe de atendentes</li>
                <li>✓ Configurar permissões de usuários</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}