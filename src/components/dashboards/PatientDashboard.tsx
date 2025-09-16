import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { Calendar, MessageCircle, FileText, Clock, LogOut } from 'lucide-react';

export function PatientDashboard() {
  const { user, logout } = useAuth();
  const { createConversation, getPatientConversations, isLoading } = useConversations();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    const conversations = await getPatientConversations();
    
    // Transform conversations into activity items
    const activities = conversations.slice(0, 3).map(conv => ({
      id: conv.id,
      type: 'message',
      title: 'Conversa iniciada',
      subtitle: conv.title,
      date: new Date(conv.created_at).toLocaleDateString('pt-BR'),
      time: new Date(conv.created_at).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));

    setRecentActivity(activities);
  };

  const handleStartChat = async () => {
    const conversation = await createConversation();
    if (conversation) {
      // Reload recent activity to show the new conversation
      loadRecentActivity();
    }
  };

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
                <p className="text-sm text-muted-foreground">Portal do Paciente</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                Nova Conversa
              </CardTitle>
              <CardDescription>
                Inicie uma conversa com nossa equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={handleStartChat}
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Chat'}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Agendamentos
              </CardTitle>
              <CardDescription>
                Visualize e gerencie suas consultas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Agenda
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Histórico
              </CardTitle>
              <CardDescription>
                Acesse seu histórico médico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Histórico
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date} às {activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Info */}
        <div className="mt-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">Suas Permissões</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>✓ Iniciar conversas com atendentes</li>
                <li>✓ Agendar consultas</li>
                <li>✓ Visualizar histórico médico próprio</li>
                <li>✓ Receber notificações de lembretes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}