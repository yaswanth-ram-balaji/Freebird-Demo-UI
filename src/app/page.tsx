'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, Users, MessageSquare, Map, Settings, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';


type Status = 'safe' | 'help' | 'danger';

const FeatureCard = ({ icon: Icon, title, description, isEmergency = false }: { icon: React.ElementType, title: string, description: string, isEmergency?: boolean }) => (
  <Card className={cn("transform transition-transform hover:scale-105 hover:shadow-xl", isEmergency ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-card')}>
    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
      <div className={cn("flex items-center justify-center w-16 h-16 mb-4 rounded-full", isEmergency ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-50 dark:bg-blue-900/30')}>
        <Icon className={cn("w-8 h-8", isEmergency ? 'text-red-500' : 'text-primary')} />
      </div>
      <h3 className="mb-1 text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);


export default function FreeBirdPage() {
  const [status, setStatus] = useState<Status>('safe');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
  const { toast } = useToast();

  const handleSendSOS = () => {
    setIsSending(true);
    // Simulate sending SOS
    setTimeout(() => {
      toast({
        title: 'SOS Alert Sent',
        description: `Your emergency alert has been broadcasted ${isSilent ? 'silently' : 'loudly'}.`,
        variant: 'destructive',
      });
      setIsSending(false);
      setIsDialogOpen(false);
    }, 1500);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-md">
        <div className="container flex items-center justify-between h-20 px-4 mx-auto md:px-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight font-headline">FreeBird</h1>
            <p className="text-sm text-primary-foreground/80">Stay Safe, Stay Connected</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="items-center hidden gap-4 md:flex">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex items-center gap-2 p-1 bg-black/10 rounded-full">
                   <Button
                      onClick={() => setStatus('safe')}
                      size="sm"
                      className={cn("rounded-full", status === 'safe' ? 'bg-green-500 text-white' : 'bg-transparent text-white/80 hover:bg-white/20')}>
                      {status === 'safe' && "I'm Safe"}
                      {status !== 'safe' && "Safe"}
                    </Button>
                   <Button
                      onClick={() => setStatus('help')}
                      size="sm"
                      variant="ghost"
                      className={cn("rounded-full", status === 'help' ? 'bg-yellow-500 text-white' : 'bg-transparent text-white/80 hover:bg-white/20')}>
                      Help
                   </Button>
                   <Button
                      onClick={() => setStatus('danger')}
                      size="sm"
                      variant="ghost"
                      className={cn("rounded-full", status === 'danger' ? 'bg-red-500 text-white' : 'bg-transparent text-white/80 hover:bg-white/20')}>
                      Danger
                   </Button>
                </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="container px-4 mx-auto md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
             <FeatureCard 
                icon={Shield}
                title="Women's Safety"
                description="Secure communication and emergency features"
              />
             <FeatureCard
                icon={AlertTriangle}
                title="Emergency"
                description="Instant SOS alerts and emergency response"
                isEmergency
              />
              <FeatureCard
                icon={Users}
                title="Rooms"
                description="Create or join private communication rooms"
              />
              <FeatureCard
                icon={MessageSquare}
                title="Public Chat"
                description="Broadcast messages to all users"
              />
              <FeatureCard
                icon={Map}
                title="Map View"
                description="See nearby users and safety zones"
              />
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3">
        <Button 
          variant="outline"
          size="icon"
          className="w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500/50 shadow-lg"
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <Ghost className={cn("h-7 w-7", isAnonymous ? 'text-white' : 'text-gray-800')} />
        </Button>
        
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    size="lg"
                    variant="destructive"
                    className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center animate-pulse-strong"
                >
                    <AlertTriangle className="w-8 h-8" />
                    <span className="sr-only">SOS</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center text-2xl">
                        <AlertTriangle className="mr-2 h-8 w-8 text-destructive" /> Confirm Emergency SOS
                    </AlertDialogTitle>
                    <AlertDialogDescription className="py-4 text-base">
                        This will immediately send an emergency alert with your current location to all nearby users and your trusted contacts. Are you sure you want to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center p-4 my-4 space-x-2 rounded-lg bg-muted">
                    <Switch id="silent-mode" checked={isSilent} onCheckedChange={setIsSilent} />
                    <Label htmlFor="silent-mode" className="flex-1">
                        <p className="font-medium">Silent Mode</p>
                        <p className="text-sm text-muted-foreground">Trigger alert without sound or vibration on your device.</p>
                    </Label>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isSending}
                        onClick={handleSendSOS}
                        className={cn(
                            "bg-destructive hover:bg-destructive/90",
                            isSending && "bg-destructive/50"
                        )}
                    >
                        {isSending ? 'Sending...' : 'Yes, Send Alert'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
