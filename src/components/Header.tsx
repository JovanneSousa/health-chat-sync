import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Search, Settings } from "lucide-react";

interface HeaderProps {
  userRole: "attendant" | "manager";
  userName: string;
  onlineCount: number;
}

export function Header({ userRole, userName, onlineCount }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-medical rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">HC</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Health Chat Sync</h1>
            <p className="text-xs text-muted-foreground">
              Sistema Omnichannel Médico
            </p>
          </div>
        </div>
        
        <Badge variant="secondary" className="gap-1">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow" />
          {onlineCount} atendentes online
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <Search className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}