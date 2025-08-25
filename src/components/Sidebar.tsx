import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings,
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  conversationCounts: {
    all: number;
    pending: number;
    inProgress: number;
    resolved: number;
    whatsapp: number;
    email: number;
    phone: number;
    instagram: number;
    facebook: number;
  };
  userRole: "attendant" | "manager";
}

export function Sidebar({ 
  activeView, 
  onViewChange, 
  conversationCounts,
  userRole 
}: SidebarProps) {
  const menuItems = [
    {
      label: "Conversas",
      icon: MessageSquare,
      id: "conversations",
      count: conversationCounts.all,
    },
    ...(userRole === "manager" ? [{
      label: "Dashboard",
      icon: BarChart3,
      id: "dashboard",
    }] : []),
    ...(userRole === "manager" ? [{
      label: "Equipe",
      icon: Users,
      id: "team",
    }] : []),
    {
      label: "Configurações",
      icon: Settings,
      id: "settings",
    },
  ];

  const filterItems = [
    {
      label: "Todas",
      icon: MessageSquare,
      id: "all",
      count: conversationCounts.all,
    },
    {
      label: "Pendentes",
      icon: AlertCircle,
      id: "pending",
      count: conversationCounts.pending,
      color: "text-warning",
    },
    {
      label: "Em Andamento",
      icon: Clock,
      id: "in-progress",
      count: conversationCounts.inProgress,
      color: "text-primary",
    },
    {
      label: "Resolvidas",
      icon: CheckCircle2,
      id: "resolved",
      count: conversationCounts.resolved,
      color: "text-success",
    },
  ];

  const channelItems = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      id: "whatsapp",
      count: conversationCounts.whatsapp,
      color: "text-green-600",
    },
    {
      label: "E-mail",
      icon: Mail,
      id: "email",
      count: conversationCounts.email,
      color: "text-blue-600",
    },
    {
      label: "Telefone",
      icon: Phone,
      id: "phone",
      count: conversationCounts.phone,
      color: "text-gray-600",
    },
    {
      label: "Instagram",
      icon: Instagram,
      id: "instagram",
      count: conversationCounts.instagram,
      color: "text-pink-600",
    },
    {
      label: "Facebook",
      icon: Facebook,
      id: "facebook",
      count: conversationCounts.facebook,
      color: "text-blue-700",
    },
  ];

  return (
    <div className="w-64 border-r bg-card/30 backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-foreground mb-3">Menu Principal</h2>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeView === item.id && "bg-primary text-primary-foreground shadow-medical"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {item.count !== undefined && (
                  <Badge 
                    variant={activeView === item.id ? "secondary" : "outline"}
                    className="ml-auto"
                  >
                    {item.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Status Filters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Por Status</h3>
            </div>
            <div className="space-y-1">
              {filterItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-3 text-sm",
                      activeView === item.id && "bg-accent"
                    )}
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon className={cn("w-4 h-4", item.color)} />
                    {item.label}
                    <Badge variant="outline" className="ml-auto text-xs">
                      {item.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Channel Filters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Por Canal</h3>
            </div>
            <div className="space-y-1">
              {channelItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-3 text-sm",
                      activeView === item.id && "bg-accent"
                    )}
                    onClick={() => onViewChange(item.id)}
                  >
                    <Icon className={cn("w-4 h-4", item.color)} />
                    {item.label}
                    <Badge variant="outline" className="ml-auto text-xs">
                      {item.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}