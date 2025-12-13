import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
  roles?: string[]; // RBAC
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Action {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

export type Theme = 'light' | 'dark' | 'system';
