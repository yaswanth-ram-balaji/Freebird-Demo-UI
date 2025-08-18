
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, Settings, MessageSquare, PlusSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { SplashScreen } from '@/components/guardian/splash-screen';


const FeatureCard = ({ icon: Icon, title, description, isEmergency = false, href }: { icon: React.ElementType, title: string, description: string, isEmergency?: boolean, href: string }) => (
  <Link href={href} className="w-full">
    <Card className={cn("transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl h-full", isEmergency ? 'bg-destructive/10 dark:bg-red-900/20 border-destructive/20 dark:border-red-800/50' : 'bg-card')}>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
        <div className={cn("flex items-center justify-center w-16 h-16 mb-4 rounded-full", isEmergency ? 'bg-destructive/20' : 'bg-primary/10')}>
          <Icon className={cn("w-8 h-8", isEmergency ? 'text-destructive' : 'text-primary')} />
        </div>
        <h3 className="mb-1 text-lg font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </Link>
);


export default function FreeBirdPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setIsLoading(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinished={handleSplashFinish} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-md">
        <div className="container flex items-center justify-between h-20 px-4 mx-auto md:px-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🕊️</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-headline">FreeBird</h1>
              <p className="text-xs text-primary-foreground/80">Stay Connected, Stay Safe</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="container px-4 mx-auto md:px-6 mt-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-stretch">
             <FeatureCard
                href="/guardian/sos"
                icon={AlertTriangle}
                title="Emergency"
                description="Instant SOS alerts and emergency response"
                isEmergency
              />
             <FeatureCard 
                href="/guardian/safety"
                icon={Shield}
                title="Women's Safety"
                description="Secure communication and emergency features"
              />
              <FeatureCard
                href="/guardian/broadcast"
                icon={MessageSquare}
                title="Public Broadcast"
                description="Send a message to all nearby users"
              />
              <FeatureCard
                href="/guardian/private"
                icon={Users}
                title="Private Chat"
                description="Request-based direct messaging"
              />
              <FeatureCard
                href="/guardian/group-rooms"
                icon={PlusSquare}
                title="Rooms"
                description="Create or join private group chats"
              />
          </div>
        </div>
      </main>
      
    </div>
  );
}
