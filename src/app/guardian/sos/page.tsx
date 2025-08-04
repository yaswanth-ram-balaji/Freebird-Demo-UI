
'use client';

import * as React from 'react';
import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function SOSPage() {
  const [isSending, setIsSending] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
  const [sendLocation, setSendLocation] = useState(true);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendSOS = () => {
    setIsSending(true);
    // Simulate sending SOS
    setTimeout(() => {
      let description = `Your emergency alert has been broadcasted ${isSilent ? 'silently' : 'loudly'}.`;
      if (sendLocation) {
        description += ' Your location has been shared.';
      }
      if (message) {
        description += ` Message: "${message}"`;
      }
      toast({
        title: 'SOS Alert Sent',
        description: description,
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
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-2">EMERGENCY SOS</h1>
        <p className="text-lg text-gray-400 mb-8 max-w-md">
          This will send an alert to your trusted contacts and nearby users.
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
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <Label htmlFor="location-mode" className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5" />
                Share Location
              </Label>
              <Switch id="location-mode" checked={sendLocation} onCheckedChange={setSendLocation} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <Label htmlFor="silent-mode" className="text-base">
                Send Silently
              </Label>
              <Switch id="silent-mode" checked={isSilent} onCheckedChange={setIsSilent} />
            </div>
          </div>
          
          <div className="relative flex items-center justify-center w-full h-32">
             <Button
              size="lg"
              variant="destructive"
              className="relative w-32 h-32 rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold"
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
            {isSending && (
                 <div className="absolute inset-0 rounded-full bg-destructive/30 animate-pulse"></div>
            )}
          </div>
           {isSending && <p className="mt-2 text-lg">Sending alert...</p>}
        </div>

      </main>
    </div>
  );
}
