import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['patient', 'attendant', 'manager'],
  fallback 
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return null; // This will be handled by the main App component
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta área do sistema.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}