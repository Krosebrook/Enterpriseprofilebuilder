import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Switch } from '../../../components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { User, Bell, Shield, Smartphone, Globe, Cloud, LogOut } from 'lucide-react';

export function Settings() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-lg text-slate-600">
          Manage your account preferences, notifications, and security settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Nav for Settings */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <TabsList className="flex flex-col h-auto w-full items-start justify-start gap-2 bg-transparent p-0">
              <TabsTrigger 
                value="profile" 
                className="w-full justify-start gap-2 px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                <User className="w-4 h-4" /> Profile
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="w-full justify-start gap-2 px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                <Shield className="w-4 h-4" /> Account & Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="w-full justify-start gap-2 px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                <Bell className="w-4 h-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="display" 
                className="w-full justify-start gap-2 px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                <Globe className="w-4 h-4" /> Display & Language
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="w-full justify-start gap-2 px-4 py-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                <Cloud className="w-4 h-4" /> Integrations
              </TabsTrigger>
            </TabsList>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <TabsContent value="profile" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Public Profile</CardTitle>
                  <CardDescription>This is how others see you on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <p className="text-xs text-slate-500">JPG, GIF or PNG. Max 1MB.</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" defaultValue="Jane Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input id="title" defaultValue="Senior Prompt Engineer" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        id="bio" 
                        defaultValue="Building the future of AI at INT Inc."
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-6">
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage how you receive updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="marketing" className="flex flex-col space-y-1">
                        <span>Marketing emails</span>
                        <span className="font-normal text-xs text-slate-500">Receive emails about new products, features, and more.</span>
                      </Label>
                      <Switch id="marketing" />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="security" className="flex flex-col space-y-1">
                        <span>Security emails</span>
                        <span className="font-normal text-xs text-slate-500">Receive emails about your account security.</span>
                      </Label>
                      <Switch id="security" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">Push Notifications</h4>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="push-mentions" className="flex flex-col space-y-1">
                        <span>Mentions</span>
                        <span className="font-normal text-xs text-slate-500">Notify me when I'm mentioned in a comment.</span>
                      </Label>
                      <Switch id="push-mentions" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your account credentials and access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                      <div className="space-y-1">
                         <h4 className="font-medium">Two-Factor Authentication</h4>
                         <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Enabled</Badge>
                   </div>

                   <div className="space-y-2">
                      <Label>Active Sessions</Label>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                         <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-slate-400" />
                            <div>
                               <p className="text-sm font-medium">MacBook Pro 16"</p>
                               <p className="text-xs text-slate-500">San Francisco, CA • Just now</p>
                            </div>
                         </div>
                         <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">Revoke</Button>
                      </div>
                   </div>

                   <div className="pt-6 border-t">
                      <h4 className="text-sm font-medium text-rose-600 mb-2">Danger Zone</h4>
                      <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <Button variant="destructive" size="sm">
                         <LogOut className="w-4 h-4 mr-2" />
                         Delete Account
                      </Button>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
