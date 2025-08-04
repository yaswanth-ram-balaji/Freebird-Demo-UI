
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { AlertTriangle, ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function SOSPage() {
  const [isSosActive, setIsSosActive] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
  const [sendLocation, setSendLocation] = useState(true);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isSosActive) {
      // Send initial alert immediately
       toast({
          title: 'SOS Activated',
          description: `Continuous alerts are being sent.`,
          variant: 'destructive',
       });
      
      // Start sending alerts periodically
      intervalId = setInterval(() => {
        let description = `Emergency alert broadcasted ${isSilent ? 'silently' : 'loudly'}.`;
         if (sendLocation) {
          description += ' Location is being shared.';
        }
         if (message) {
          description += ` Message: "${message}"`;
        }
        toast({
          title: 'SOS Alert Sent (Continuous)',
          description: description,
          variant: 'destructive',
          duration: 4000, // Make toast visible for a shorter time
        });
      }, 5000); // Send an alert every 5 seconds
    } else {
       if (intervalId) {
         clearInterval(intervalId);
       }
    }

    // Cleanup function to clear the interval when the component unmounts or SOS is deactivated
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSosActive, isSilent, sendLocation, message, toast]);

  const toggleSOS = () => {
    setIsSosActive(prev => {
        if(!prev === false) { // If we are turning it off
             toast({
                title: 'SOS Deactivated',
                description: 'You are no longer broadcasting an emergency alert.',
            });
        }
        return !prev;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="absolute top-0 left-0 w-full p-4">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" disabled={isSosActive}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">EMERGENCY SOS</h1>
        <p className="text-lg text-gray-400 mb-8 max-w-md">
          {isSosActive 
            ? "An emergency alert is being continuously broadcasted."
            : "This will send a continuous alert to your trusted contacts and nearby users."
          }
        </p>

        <div className="w-full max-w-sm space-y-6">
          <div className="grid w-full gap-2 text-left">
            <Label htmlFor="message">Optional Message</Label>
            <Textarea 
              id="message" 
              placeholder="e.g., I'm at the library, back entrance." 
              className="bg-gray-800 border-gray-700 text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSosActive}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <Label htmlFor="location-mode" className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5" />
                Share Location
              </Label>
              <Switch id="location-mode" checked={sendLocation} onCheckedChange={setSendLocation} disabled={isSosActive}/>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <Label htmlFor="silent-mode" className="text-base">
                Send Silently
              </Label>
              <Switch id="silent-mode" checked={isSilent} onCheckedChange={setIsSilent} disabled={isSosActive}/>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center w-full h-32">
             <Button
              size="lg"
              variant="destructive"
              className={cn(
                "relative w-32 h-32 rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold",
                 isSosActive && 'animate-pulse-strong'
              )}
              onClick={toggleSOS}
            >
              {isSosActive ? "STOP" : "SOS"}
            </Button>
          </div>
           {isSosActive && <p className="mt-2 text-lg animate-pulse">Sending alerts...</p>}
        </div>

      </main>
    </div>
  );
}
