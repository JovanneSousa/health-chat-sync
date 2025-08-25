import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  Star
} from "lucide-react";

interface MetricsData {
  totalConversations: number;
  activeConversations: number;
  resolvedToday: number;
  avgResponseTime: string;
  satisfactionRate: number;
  channelStats: {
    whatsapp: number;
    email: number;
    phone: number;
    instagram: number;
    facebook: number;
  };
  attendantStats: {
    name: string;
    conversations: number;
    avgResponse: string;
    satisfaction: number;
  }[];
}

interface MetricsDashboardProps {
  metrics: MetricsData;
  userRole: "attendant" | "manager";
}

export function MetricsDashboard({ metrics, userRole }: MetricsDashboardProps) {
  const channelIcons = {
    whatsapp: MessageCircle,
    email: Mail,
    phone: Phone,
    instagram: MessageSquare,
    facebook: MessageSquare,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeConversations}</div>
            <p className="text-xs text-muted-foreground">
              Ativos agora
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos Hoje</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8%</span> eficiência
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Tempo de resposta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Distribution */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Distribuição por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.channelStats).map(([channel, count]) => {
              const Icon = channelIcons[channel as keyof typeof channelIcons];
              const total = Object.values(metrics.channelStats).reduce((a, b) => a + b, 0);
              const percentage = (count / total) * 100;
              
              return (
                <div key={channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="font-medium capitalize">{channel}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 max-w-xs">
                    <Progress value={percentage} className="flex-1" />
                    <span className="text-sm font-medium min-w-[3rem] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Satisfaction Rate */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            Taxa de Satisfação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{metrics.satisfactionRate}%</div>
            <div className="flex-1">
              <Progress value={metrics.satisfactionRate} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Baseado em {metrics.resolvedToday} avaliações hoje
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendant Performance (Manager only) */}
      {userRole === "manager" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Performance dos Atendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.attendantStats.map((attendant, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {attendant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{attendant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {attendant.conversations} conversas
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {attendant.avgResponse}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm font-medium">{attendant.satisfaction}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}