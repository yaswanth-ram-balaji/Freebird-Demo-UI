
'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ArrowLeft, Globe, MessageSquareWarning, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

const QUICK_MESSAGES = [
    "I'm in danger, please help.",
    "Call the police.",
    "Track my location.",
    "I'm feeling unsafe, please check on me."
];


export default function SOSPage() {
  const [isSosActive, setIsSosActive] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
  const [sendLocation, setSendLocation] = useState(true);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const alertCount = useRef(0);
  const MAX_ALERTS_TO_SHOW = 3;

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isSosActive) {
      alertCount.current = 0; // Reset counter on activation
      
      const sendAlertToast = () => {
        if (alertCount.current < MAX_ALERTS_TO_SHOW) {
          let title = alertCount.current === 0 ? 'SOS Activated' : 'SOS Alert Sent (Continuous)';
          let description = `Emergency alert sent to trusted contacts.`;
          
          if (sendLocation) {
            description += ' Location is being shared.';
          }
           if (message) {
            description += ` Message: "${message}"`;
          }

          toast({
            title: title,
            description: description,
            variant: 'destructive',
            duration: 4000, 
          });
          alertCount.current++;
        }
      };
      
      sendAlertToast(); // Send initial alert immediately

      intervalId = setInterval(sendAlertToast, 5000); 
    } else {
       if (intervalId) {
         clearInterval(intervalId);
       }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSosActive, isSilent, sendLocation, message, toast]);

  const toggleSOS = () => {
    const turningOn = !isSosActive;
    if (!turningOn) { // If we are turning it off
        toast({
            title: 'SOS Deactivated',
            description: 'You are no longer broadcasting an emergency alert.',
        });
    }
    setIsSosActive(turningOn);
  };
  
  const handleQuickMessageClick = (msg: string) => {
    setMessage(msg);
    toast({ title: "Message selected", description: `"${msg}" will be sent with your alert.`})
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="absolute top-0 left-0 w-full p-4 z-10">
        <Link href="/guardian/safety" passHref>
          <Button variant="ghost" size="icon" disabled={isSosActive}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-between text-center p-4 pt-20 overflow-y-auto">
        <div className={cn("w-full max-w-md space-y-6 transition-opacity", isSosActive ? 'opacity-50 pointer-events-none' : 'opacity-100')}>
            
            <div>
                <Label className="text-lg font-semibold mb-3 flex items-center justify-center gap-2"><MessageSquareWarning/> Quick Emergency Messages</Label>
                <div className="grid grid-cols-2 gap-2">
                    {QUICK_MESSAGES.map((msg, index) => (
                        <Button key={index} variant="outline" className="bg-gray-800/50 border-gray-700 h-auto py-2 whitespace-normal" onClick={() => handleQuickMessageClick(msg)}>
                            {msg}
                        </Button>
                    ))}
                </div>
            </div>
            
            <div>
                <Label className="text-lg font-semibold mb-3 flex items-center justify-center gap-2"><Pencil/> Custom Message</Label>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Optional: type a custom message..."
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-destructive"
                    rows={3}
                    disabled={isSosActive}
                />
            </div>

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
                 <p className="text-xs text-gray-400">No sound or vibration on your device</p>
            </Label>
            <Switch id="silent-mode" checked={isSilent} onCheckedChange={setIsSilent} disabled={isSosActive}/>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center pt-8">
            <div className="relative w-48 h-48 flex items-center justify-center mb-8 flex-shrink-0">
                <Button
                size="lg"
                variant="destructive"
                className={cn(
                    "relative w-48 h-48 rounded-full shadow-2xl flex items-center justify-center text-4xl font-bold z-10",
                    isSosActive && 'animate-pulse-strong'
                )}
                onClick={toggleSOS}
                >
                {isSosActive ? "STOP" : "SOS"}
                </Button>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 flex-shrink-0">EMERGENCY SOS</h1>
            <p className="text-lg text-gray-400 mb-4 max-w-md flex-shrink-0">
            {isSosActive 
                ? "An emergency alert is being continuously broadcasted."
                : "Press the button to send an alert to your trusted contacts."
            }
            </p>
            
            {isSosActive && <p className="text-xl animate-pulse font-semibold text-destructive-foreground flex-shrink-0">Sending alerts...</p>}
        </div>

      </main>
    </div>
  );
}

