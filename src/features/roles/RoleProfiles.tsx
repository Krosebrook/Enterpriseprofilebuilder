import React from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { Card } from '../../../components/ui/Card';
import { Settings as SettingsIcon, Shield, Code, Users as UsersIcon } from 'lucide-react';
import { ROLE_PROFILES } from './data/roleData';

export function RoleProfiles() {
  const { selectedRole } = useNavigation();

  const filteredProfiles = selectedRole === 'All' 
    ? ROLE_PROFILES 
    : ROLE_PROFILES.filter(p => p.role === selectedRole);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Role Profiles" 
        description={selectedRole === 'All' 
          ? "Role-specific capabilities, permissions, and workflow templates. Select your role in the top bar to filter."
          : `Detailed operational profile for the ${selectedRole} role, including permissions, tools, and specific workflows.`}
        icon={UsersIcon}
      />

      <div className="grid grid-cols-1 gap-12">
        {filteredProfiles.map((profile) => {
          const Icon = profile.icon;
          // Clean dynamic class generation for better stability
          const themeColor = {
             green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600' },
             blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
             purple: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600' },
             orange: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' }
          }[profile.color as string] || { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: 'text-slate-600' };

          return (
            <div key={profile.role} className="space-y-6">
              {/* Header Card */}
              <div className={`${themeColor.bg} ${themeColor.border} border rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start shadow-sm`}>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <Icon className={`w-10 h-10 ${themeColor.icon}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{profile.role} Role Profile</h3>
                  <p className="text-slate-700 text-lg leading-relaxed">{profile.responsibilities}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Capabilities */}
                 <Card>
                   <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5 text-slate-400" />
                      Key Capabilities
                   </h4>
                   <ul className="space-y-3">
                     {profile.capabilities.map((capability, index) => (
                       <li key={index} className="flex items-start gap-3 text-slate-700 text-sm">
                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                         {capability}
                       </li>
                     ))}
                   </ul>
                 </Card>

                 {/* Permissions */}
                 <Card>
                   <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-slate-400" />
                      Permissions & Access
                   </h4>
                   <div className="space-y-4">
                     <div>
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Enabled Features</div>
                        <div className="flex flex-wrap gap-2">
                           {profile.features.enabled.map((f, i) => (
                              <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-100 font-medium">
                                 {f}
                              </span>
                           ))}
                        </div>
                     </div>
                     {profile.features.disabled.length > 0 && (
                        <div>
                           <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Restricted</div>
                           <div className="flex flex-wrap gap-2">
                              {profile.features.disabled.map((f, i) => (
                                 <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs border border-rose-100 font-medium">
                                    {f}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}
                   </div>
                 </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1">
                    <Card className="h-full bg-slate-50 border-slate-200">
                       <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Standard Tools</h4>
                       <ul className="space-y-2">
                          {profile.tools.map((tool, i) => (
                             <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                <Code className="w-3 h-3 text-slate-400" />
                                {tool}
                             </li>
                          ))}
                       </ul>
                    </Card>
                 </div>
                 
                 <div className="md:col-span-2">
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 h-full">
                       <h4 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-200 text-rose-700 text-xs">!</span>
                          Mandatory Escalation Triggers
                       </h4>
                       <ul className="grid grid-cols-1 gap-2">
                          {profile.escalationRules.map((rule, i) => (
                             <li key={i} className="text-sm text-rose-800 flex items-start gap-2 bg-white/50 p-2 rounded">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                                {rule}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>

              {/* Workflows */}
              <div>
                 <h4 className="text-lg font-bold text-slate-900 mb-4">Standard Operating Procedures</h4>
                 <div className="grid grid-cols-1 gap-4">
                    {profile.commonRequests.map((req, i) => (
                       <Card key={i} className="bg-slate-50 border-slate-200">
                          <div className="mb-4">
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trigger Request</span>
                             <p className="font-medium text-slate-900 mt-1">"{req.request}"</p>
                          </div>
                          <div>
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Execution Steps</span>
                             <div className="mt-2 flex flex-col md:flex-row gap-4 text-sm text-slate-600 overflow-x-auto">
                                {req.process.map((step, j) => (
                                   <div key={j} className="flex-1 min-w-[150px] relative">
                                      <div className="flex items-center gap-2 mb-1">
                                         <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">{j+1}</span>
                                         {j < req.process.length - 1 && <div className="h-0.5 flex-1 bg-slate-200 md:block hidden" />}
                                      </div>
                                      <p>{step}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </Card>
                    ))}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
