import { User } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Role } from '../../types';

const roles: Role[] = [
  'All', 
  'Finance', 
  'Sales', 
  'Engineering', 
  'Marketing', 
  'Operations', 
  'HR',
  'Product Management',
  'Legal',
  'Customer Support',
  'Data Science',
  'Executive / Leadership',
  'QA / Testing'
];

export function RoleSelector() {
  const { selectedRole, setSelectedRole } = useNavigation();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-300 px-3 py-1.5 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-shadow">
      <User className="w-4 h-4 text-slate-500" />
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value as Role)}
        className="bg-transparent border-none text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 cursor-pointer min-w-[120px]"
        aria-label="Select Role"
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
