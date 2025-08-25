import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PatientDashboard } from './dashboards/PatientDashboard';
import { AttendantDashboard } from './dashboards/AttendantDashboard';
import { ManagerDashboard } from './dashboards/ManagerDashboard';

export function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'attendant':
      return <AttendantDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return null;
  }
}