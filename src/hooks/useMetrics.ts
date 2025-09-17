import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MetricsData {
  totalConversations: number;
  activeConversations: number;
  resolvedToday: number;
  pendingConversations: number;
  avgResponseTimeMinutes: number;
  satisfactionRate: number;
  channelStats: {
    whatsapp: number;
    email: number;
    phone: number;
    instagram: number;
    facebook: number;
  };
  attendantStats: {
    id: string;
    name: string;
    conversations: number;
    avgResponseMinutes: number;
    resolvedToday: number;
    isOnline: boolean;
  }[];
}

export function useMetrics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<MetricsData>({
    totalConversations: 0,
    activeConversations: 0,
    resolvedToday: 0,
    pendingConversations: 0,
    avgResponseTimeMinutes: 0,
    satisfactionRate: 0,
    channelStats: {
      whatsapp: 0,
      email: 0,
      phone: 0,
      instagram: 0,
      facebook: 0,
    },
    attendantStats: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);

      // Get total conversations
      const { count: totalConversations } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });

      // Get active conversations
      const { count: activeConversations } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get pending conversations
      const { count: pendingConversations } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get resolved conversations today
      const today = new Date().toISOString().split('T')[0];
      const { count: resolvedToday } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved')
        .gte('updated_at', today);

      // Get attendant stats (for managers)
      let attendantStats: MetricsData['attendantStats'] = [];
      if (user?.role === 'manager') {
        const { data: attendants } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', 'attendant');

        if (attendants) {
          for (const attendant of attendants) {
            // Count conversations for this attendant
            const { count: conversations } = await supabase
              .from('conversations')
              .select('*', { count: 'exact', head: true })
              .eq('attendant_id', attendant.id);

            // Count resolved today for this attendant
            const { count: resolvedTodayCount } = await supabase
              .from('conversations')
              .select('*', { count: 'exact', head: true })
              .eq('attendant_id', attendant.id)
              .eq('status', 'resolved')
              .gte('updated_at', today);

            attendantStats.push({
              id: attendant.id,
              name: attendant.name,
              conversations: conversations || 0,
              avgResponseMinutes: Math.floor(Math.random() * 10) + 1, // Mock for now
              resolvedToday: resolvedTodayCount || 0,
              isOnline: Math.random() > 0.3, // Mock online status
            });
          }
        }
      }

      // Channel stats (mock for now since we don't have channel data)
      const channelStats = {
        whatsapp: Math.floor((activeConversations || 0) * 0.6),
        email: Math.floor((activeConversations || 0) * 0.2),
        phone: Math.floor((activeConversations || 0) * 0.1),
        instagram: Math.floor((activeConversations || 0) * 0.05),
        facebook: Math.floor((activeConversations || 0) * 0.05),
      };

      setMetrics({
        totalConversations: totalConversations || 0,
        activeConversations: activeConversations || 0,
        resolvedToday: resolvedToday || 0,
        pendingConversations: pendingConversations || 0,
        avgResponseTimeMinutes: Math.floor(Math.random() * 10) + 1, // Mock for now
        satisfactionRate: Math.floor(Math.random() * 20) + 80, // Mock 80-100%
        channelStats,
        attendantStats,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: 'Erro ao carregar métricas',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  return { metrics, isLoading, refetchMetrics: fetchMetrics };
}