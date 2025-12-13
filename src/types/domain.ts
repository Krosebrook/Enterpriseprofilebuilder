export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  reducedMotion: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface DeploymentPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  tasks: DeploymentTask[];
  startDate?: string;
  endDate?: string;
}

export interface DeploymentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string; // User ID
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastCheck: string;
  services: {
    database: 'up' | 'down';
    api: 'up' | 'down';
    auth: 'up' | 'down';
  };
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
