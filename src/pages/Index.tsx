import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ConversationList, type Conversation } from "@/components/ConversationList";
import { ChatInterface } from "@/components/ChatInterface";
import { MetricsDashboard } from "@/components/MetricsDashboard";

// Mock data for demonstration
const mockConversations: Conversation[] = [
  {
    id: "1",
    patientName: "Maria Silva",
    channel: "whatsapp",
    lastMessage: "Gostaria de agendar uma consulta com o Dr. João",
    timestamp: "10:30",
    status: "pending",
    priority: "high",
    unreadCount: 2,
  },
  {
    id: "2", 
    patientName: "José Santos",
    channel: "email",
    lastMessage: "Preciso dos resultados do exame de sangue",
    timestamp: "09:45",
    status: "in-progress",
    priority: "medium",
    attendant: "Ana Costa",
    unreadCount: 0,
  },
  {
    id: "3",
    patientName: "Ana Oliveira",
    channel: "phone",
    lastMessage: "Ligação: Cancelamento de consulta",
    timestamp: "Ontem",
    status: "resolved",
    priority: "low",
    attendant: "Carlos Lima",
    unreadCount: 0,
  },
  {
    id: "4",
    patientName: "Pedro Costa",
    channel: "instagram",
    lastMessage: "Vocês atendem convênio Unimed?",
    timestamp: "14:20",
    status: "pending",
    priority: "medium",
    unreadCount: 1,
  },
  {
    id: "5",
    patientName: "Lucia Fernandes",
    channel: "facebook",
    lastMessage: "Obrigada pelo atendimento!",
    timestamp: "13:15",
    status: "resolved",
    priority: "low",
    attendant: "Ana Costa",
    unreadCount: 0,
  },
];

const mockMessages = [
  {
    id: "1",
    text: "Boa tarde! Gostaria de agendar uma consulta com o Dr. João para a próxima semana.",
    timestamp: "10:25",
    sender: "patient" as const,
    type: "text" as const,
  },
  {
    id: "2",
    text: "Olá Maria! Tudo bem? Vou verificar a agenda do Dr. João para você. Qual especialidade você precisa?",
    timestamp: "10:28",
    sender: "attendant" as const,
    type: "text" as const,
  },
  {
    id: "3",
    text: "É para cardiologia. Tenho preferência para tarde se possível.",
    timestamp: "10:30",
    sender: "patient" as const,
    type: "text" as const,
  },
];

const mockMetrics = {
  totalConversations: 147,
  activeConversations: 23,
  resolvedToday: 89,
  avgResponseTime: "2m 34s",
  satisfactionRate: 94,
  channelStats: {
    whatsapp: 65,
    email: 28,
    phone: 31,
    instagram: 15,
    facebook: 8,
  },
  attendantStats: [
    {
      name: "Ana Costa",
      conversations: 34,
      avgResponse: "1m 45s",
      satisfaction: 96,
    },
    {
      name: "Carlos Lima",
      conversations: 28,
      avgResponse: "2m 12s",
      satisfaction: 92,
    },
    {
      name: "Beatriz Santos",
      conversations: 27,
      avgResponse: "1m 58s",
      satisfaction: 94,
    },
  ],
};

const Index = () => {
  const [activeView, setActiveView] = useState("conversations");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [userRole] = useState<"attendant" | "manager">("manager"); // Can be changed

  const conversationCounts = {
    all: mockConversations.length,
    pending: mockConversations.filter(c => c.status === "pending").length,
    inProgress: mockConversations.filter(c => c.status === "in-progress").length,
    resolved: mockConversations.filter(c => c.status === "resolved").length,
    whatsapp: mockConversations.filter(c => c.channel === "whatsapp").length,
    email: mockConversations.filter(c => c.channel === "email").length,
    phone: mockConversations.filter(c => c.channel === "phone").length,
    instagram: mockConversations.filter(c => c.channel === "instagram").length,
    facebook: mockConversations.filter(c => c.channel === "facebook").length,
  };

  const handleSendMessage = (text: string) => {
    console.log("Sending message:", text);
    // In a real app, this would send the message to the backend
  };

  const renderMainContent = () => {
    if (activeView === "dashboard") {
      return <MetricsDashboard metrics={mockMetrics} userRole={userRole} />;
    }

    if (activeView === "conversations" || activeView.includes("-") || ["all", "pending", "in-progress", "resolved", "whatsapp", "email", "phone", "instagram", "facebook"].includes(activeView)) {
      return (
        <div className="flex h-full">
          <div className="w-96 border-r bg-card/20">
            <div className="p-4 border-b bg-card/50">
              <h2 className="font-semibold text-foreground">Conversas</h2>
              <p className="text-sm text-muted-foreground">
                {conversationCounts.all} conversas totais
              </p>
            </div>
            <ConversationList
              conversations={mockConversations}
              selectedId={selectedConversation?.id}
              onSelect={setSelectedConversation}
              filter={activeView}
            />
          </div>
          
          <div className="flex-1">
            {selectedConversation ? (
              <ChatInterface
                conversation={selectedConversation}
                messages={mockMessages}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-subtle">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-primary-foreground font-bold text-xl">HC</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Selecione uma conversa
                  </h3>
                  <p className="text-muted-foreground">
                    Escolha uma conversa para começar o atendimento
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Funcionalidade em desenvolvimento</h2>
        <p className="text-muted-foreground mt-2">Esta seção será implementada em breve.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        userRole={userRole}
        userName={userRole === "manager" ? "Dr. Ricardo Mendes" : "Ana Costa"}
        onlineCount={8}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          conversationCounts={conversationCounts}
          userRole={userRole}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
