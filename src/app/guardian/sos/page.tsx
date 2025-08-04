
'use client';

import * as React from 'react';
import { useState } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SOSPage() {
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
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="absolute top-0 left-0 w-full p-4">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold mb-4">EMERGENCY SOS</h1>
        <p className="text-lg text-gray-400 mb-12 max-w-md">
          Press and hold the button to send an alert with your location to your trusted contacts and nearby users.
        </p>
        
        <div className="relative flex items-center justify-center w-64 h-64">
          <div className={cn("absolute inset-0 rounded-full bg-destructive/30 animate-pulse-strong", isSending && "animate-none")}></div>
          <Button
            size="lg"
            variant="destructive"
            className="relative w-48 h-48 rounded-full shadow-2xl flex items-center justify-center text-4xl font-bold"
            onClick={handleSendSOS}
            disabled={isSending}
          >
            {isSending ? (
              <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "SOS"}
          </Button>
        </div>

        <div className="flex items-center space-x-3 mt-12">
          <Switch id="silent-mode" checked={isSilent} onCheckedChange={setIsSilent} />
          <Label htmlFor="silent-mode" className="text-base">
            Silent Mode
          </Label>
        </div>
        
        {isSending && <p className="mt-4 text-lg">Sending alert...</p>}

        <div className="absolute bottom-8 text-center text-gray-500">
            <p>Your approximate GPS coordinates:</p>
            <p className="font-mono">Lat: 34.0522, Lng: -118.2437</p>
        </div>
      </main>
    </div>
  );
}
