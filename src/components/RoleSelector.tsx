import { Role } from '../App';
import { User } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

const roles: Role[] = ['All', 'Finance', 'Sales', 'Engineering', 'Marketing', 'Operations', 'HR'];

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <User className="w-5 h-5 text-slate-600" />
      <select
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role === 'All' ? 'All Roles' : role}
          </option>
        ))}
      </select>
    </div>
  );
}
