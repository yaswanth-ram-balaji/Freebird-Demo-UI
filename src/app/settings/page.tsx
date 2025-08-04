
'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Bell, Shield, Moon, Sun, Palette, QrCode, LogOut, Ghost, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/context/theme-provider';

const SettingsItem = ({ icon: Icon, title, description, action }: { icon: React.ElementType, title: string, description?: string, action: React.ReactNode }) => (
  <div className="flex items-center py-4">
    <div className="flex items-center gap-4">
      <Icon className="w-6 h-6 text-muted-foreground" />
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
    <div className="ml-auto">{action}</div>
  </div>
);

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isAnonymous, setIsAnonymous] = useState(true);

  const isDarkMode = theme === 'dark';

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Settings</h1>
          <div className="w-8"></div>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-2xl px-4 mx-auto md:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://i.pravatar.cc/150?u=user1" alt="Demo User" />
                <AvatarFallback>DU</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Demo User</CardTitle>
                <p className="text-muted-foreground">Status: Safe and sound</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">Edit Profile</Button>
            </CardHeader>
          </Card>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Account & Security</h3>
            <Card>
              <CardContent className="divide-y">
                <SettingsItem
                  icon={Ghost}
                  title="Anonymous Mode"
                  description="Hide your identity in public chats"
                  action={<Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />}
                />
                <SettingsItem
                  icon={Shield}
                  title="Trusted Contacts"
                  description="Manage who sees your status"
                  action={<Button variant="ghost" size="icon"><ChevronRight/></Button>}
                />
                 <SettingsItem
                  icon={QrCode}
                  title="Sync Contacts"
                  description="Add contacts via QR code"
                   action={<Button variant="ghost" size="icon"><ChevronRight/></Button>}
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Appearance</h3>
            <Card>
              <CardContent className="divide-y">
                <SettingsItem
                  icon={isDarkMode ? Moon : Sun}
                  title="Dark Mode"
                  action={<Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />}
                />
                <SettingsItem
                  icon={Palette}
                  title="Theme"
                  description="Customize app colors"
                   action={<Button variant="ghost" size="icon"><ChevronRight/></Button>}
                />
              </CardContent>
            </Card>
          </div>
          
           <div className="mt-8">
            <Card>
              <CardContent className="pt-6">
                 <SettingsItem
                    icon={LogOut}
                    title="Logout"
                    action={<Button variant="destructive" size="sm">Logout</Button>}
                  />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
