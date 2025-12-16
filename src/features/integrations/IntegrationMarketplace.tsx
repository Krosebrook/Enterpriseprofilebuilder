import React, { useState } from 'react';
import { useIntegrationsStore } from './hooks/useIntegrationsStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Check, Settings, AlertCircle } from 'lucide-react';
import { integrationCategories } from '../../data/integrations';
import { useToast } from '../../contexts/ToastContext';

export function IntegrationMarketplace() {
  const { 
    getFilteredIntegrations, 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setCategory,
    installedIntegrations,
    installIntegration,
    uninstallIntegration
  } = useIntegrationsStore();

  const { addToast } = useToast();
  const integrations = getFilteredIntegrations();

  const handleInstall = (id: string, name: string) => {
    installIntegration(id);
    addToast({ title: "Integration Added", description: `${name} has been successfully installed.`, type: "success" });
  };

  const handleUninstall = (id: string, name: string) => {
    uninstallIntegration(id);
    addToast({ title: "Integration Removed", description: `${name} has been disconnected.`, type: "info" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Integrations Marketplace</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Supercharge Claude with your favorite tools and services.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search apps..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        {integrationCategories.map(cat => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCategory(cat.id)}
            className="rounded-full"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((app) => {
          const isInstalled = installedIntegrations.includes(app.id);
          const Icon = app.icon;

          return (
            <Card key={app.id} className={`flex flex-col transition-all hover:shadow-lg ${isInstalled ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${isInstalled ? 'bg-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  {isInstalled && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <Check className="w-3 h-3 mr-1" /> Installed
                    </Badge>
                  )}
                  {app.status === 'beta' && !isInstalled && (
                    <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50">Beta</Badge>
                  )}
                  {app.status === 'coming_soon' && (
                     <Badge variant="secondary" className="opacity-70">Coming Soon</Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{app.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {app.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capabilities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {app.features.slice(0, 3).map(f => (
                      <Badge key={f} variant="outline" className="text-[10px] bg-white dark:bg-gray-900">{f}</Badge>
                    ))}
                    {app.features.length > 3 && (
                      <Badge variant="outline" className="text-[10px] bg-white dark:bg-gray-900">+{app.features.length - 3}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100 dark:border-gray-800/50">
                {isInstalled ? (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => {}}>
                      <Settings className="w-4 h-4 mr-2" /> Configure
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleUninstall(app.id, app.name)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    disabled={app.status === 'coming_soon'}
                    onClick={() => handleInstall(app.id, app.name)}
                  >
                    {app.status === 'coming_soon' ? 'Notify Me' : (
                      <>
                        <Plus className="w-4 h-4 mr-2" /> Install Integration
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
