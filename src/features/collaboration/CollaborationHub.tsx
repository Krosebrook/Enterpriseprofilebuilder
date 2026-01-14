import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  Circle,
  FolderPlus,
  Bot
} from 'lucide-react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

// Mock Data
const workspaces = [
  { id: 1, name: 'Finance Automation', members: 4, agents: 3, updated: '2h ago' },
  { id: 2, name: 'Customer Support V2', members: 8, agents: 5, updated: '1d ago' },
  { id: 3, name: 'Legal Review Team', members: 2, agents: 1, updated: '3d ago' },
];

const activityFeed = [
  { id: 1, user: 'Sarah Chen', action: 'updated', target: 'Budget Analyst Agent', time: '10m ago' },
  { id: 2, user: 'Mike Ross', action: 'commented on', target: 'Compliance Rules', time: '1h ago' },
  { id: 3, user: 'Jessica Pearson', action: 'deployed', target: 'Contract Reviewer v1.2', time: '4h ago' },
];

export function CollaborationHub() {
  const [activeTab, setActiveTab] = useState('workspaces');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionHeader 
        title="Team Collaboration" 
        description="Shared workspaces for co-creating and managing AI agents."
        icon={Users}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="workspaces" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="workspaces">My Workspaces</TabsTrigger>
                <TabsTrigger value="shared">Shared with Me</TabsTrigger>
              </TabsList>
              <Button size="sm">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Workspace
              </Button>
            </div>

            <TabsContent value="workspaces" className="space-y-4">
              {workspaces.map((ws) => (
                <Card key={ws.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <Users className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{ws.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ws.members} members</span>
                          <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> {ws.agents} agents</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="text-[10px] bg-slate-200">U{i}</AvatarFallback>
                        </Avatar>
                      ))}
                      {ws.members > 3 && (
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-slate-500">
                          +{ws.members - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {ws.updated}
                    </span>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="shared">
               <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p>No shared workspaces yet.</p>
               </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Activity Feed */}
        <div className="space-y-6">
          <Card>
             <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                <Badge variant="outline" className="text-[10px]">Live</Badge>
             </div>
             
             <div className="space-y-4">
                {activityFeed.map((item) => (
                   <div key={item.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 mt-1">
                         <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">
                            {item.user.split(' ').map(n => n[0]).join('')}
                         </AvatarFallback>
                      </Avatar>
                      <div>
                         <p className="text-sm text-slate-900">
                            <span className="font-semibold">{item.user}</span> {item.action} <span className="font-medium text-slate-700">{item.target}</span>
                         </p>
                         <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                      </div>
                   </div>
                ))}
             </div>
             
             <Button variant="ghost" size="sm" className="w-full mt-4 text-slate-500">
                View All Activity
             </Button>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
             <h3 className="font-bold text-lg mb-2">Invite your team</h3>
             <p className="text-indigo-100 text-sm mb-4">Collaborate on prompts and agents in real-time.</p>
             <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none">
                <Plus className="w-4 h-4 mr-2" />
                Invite Members
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
