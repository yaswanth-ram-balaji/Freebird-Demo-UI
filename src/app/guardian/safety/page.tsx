
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Siren, Shield, UserCheck, Calculator, Map, PhoneOutgoing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const FeatureCard = ({ icon: Icon, title, description, href, isEmergency = false }: { icon: React.ElementType, title: string, description: string, href: string, isEmergency?: boolean }) => (
  <Link href={href} className="block transform transition-transform duration-300 hover:scale-105">
    <Card className={cn("h-full", isEmergency ? 'bg-destructive/10 border-destructive/20' : '')}>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className={cn("flex items-center justify-center w-12 h-12 rounded-full", isEmergency ? 'bg-destructive/20 text-destructive' : 'bg-primary/10 text-primary')}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
                 <CardTitle>{title}</CardTitle>
                 <CardDescription className="text-muted-foreground mt-1">{description}</CardDescription>
            </div>
        </div>
      </CardHeader>
    </Card>
  </Link>
);


export default function SafetyDashboardPage() {
    const [isSirenEnabled, setIsSirenEnabled] = React.useState(false);
    const { toast } = useToast();

    const handleSosClick = () => {
        toast({
            title: 'SOS Alert Sent',
            description: "Your location and an emergency alert have been sent to your trusted contacts.",
            variant: 'destructive',
            duration: 5000,
        });
    };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex items-center h-16 px-4 mx-auto md:px-6">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Women's Safety</h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-4xl mx-auto space-y-8">
          
          <div onClick={handleSosClick} className="block">
            <Link href="/guardian/sos">
              <Card className="bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors cursor-pointer shadow-lg hover:shadow-xl animate-pulse-strong">
                  <CardContent className="p-6 flex items-center justify-center text-center">
                      <div className="flex items-center gap-4">
                          <PhoneOutgoing className="h-10 w-10" />
                          <div>
                              <h2 className="text-2xl font-bold">One-Tap SOS Alert</h2>
                              <p className="opacity-80">Instantly send an alert with your location</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FeatureCard
                icon={UserCheck}
                title="Trusted Contacts"
                description="Manage who receives your SOS alerts"
                href="/guardian/safety/contacts"
              />
            <FeatureCard
                icon={Map}
                title="Emergency Map View"
                description="Find nearby safe zones like police stations"
                href="/guardian/safety/map"
              />
            <FeatureCard
                icon={Calculator}
                title="Fake Screen Mode"
                description="Disguise the app while sending silent alerts"
                href="/guardian/safety/fake-screen"
              />
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <Siren className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>Danger Sound Alarm</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">Play a loud siren to attract attention</CardDescription>
                        </div>
                        <Switch id="siren-mode" checked={isSirenEnabled} onCheckedChange={setIsSirenEnabled} />
                    </div>
                </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
