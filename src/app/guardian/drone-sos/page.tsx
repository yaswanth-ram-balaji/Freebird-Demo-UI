
'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Info, MapPin, Battery, Rss, CircleDotDashed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';

const MOCK_LOCATION = {
    latitude: 34.0522,
    longitude: -118.2437,
};

export default function DroneSOSPage() {
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isSilent, setIsSilent] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const [broadcastCount, setBroadcastCount] = useState(0);
    const [location, setLocation] = useState<typeof MOCK_LOCATION | null>(null);
    const [battery, setBattery] = useState<number | null>(null);
    const [isMoving, setIsMoving] = useState(false);

    const { toast } = useToast();
    const broadcastInterval = useRef<NodeJS.Timeout | null>(null);

    // Get initial data on mount
    useEffect(() => {
        setLocation(MOCK_LOCATION);

        // Simulate motion detection
        const motionTimer = setInterval(() => {
            setIsMoving(Math.random() > 0.5);
        }, 3000);
        
        // Get battery status
        const getBattery = async () => {
             if ('getBattery' in navigator) {
                try {
                    const batteryManager = await (navigator as any).getBattery();
                    setBattery(Math.round(batteryManager.level * 100));
                    batteryManager.onlevelchange = () => {
                        setBattery(Math.round(batteryManager.level * 100));
                    };
                } catch (err) {
                    console.error("Could not get battery status", err);
                    setBattery(88); // Fallback
                }
            } else {
                setBattery(88); // Fallback for unsupported browsers
            }
        }
        getBattery();


        return () => {
            clearInterval(motionTimer);
            if (broadcastInterval.current) {
                clearInterval(broadcastInterval.current);
            }
        };
    }, []);

    const addLogEntry = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLog(prevLog => [`[${timestamp}] ${message}`, ...prevLog.slice(0, 4)]);
    };

    const handleBroadcastToggle = (shouldBroadcast: boolean) => {
        setIsBroadcasting(shouldBroadcast);

        if (shouldBroadcast) {
            addLogEntry("SOS broadcasting started.");
            setBroadcastCount(0);

            // Immediately send first broadcast
            sendBroadcast(); 

            broadcastInterval.current = setInterval(() => {
                sendBroadcast();
            }, 5000);
            
             toast({
                title: "Drone SOS Activated",
                description: "Broadcasting your location to nearby drones.",
                variant: 'destructive'
            });

        } else {
            if (broadcastInterval.current) {
                clearInterval(broadcastInterval.current);
                broadcastInterval.current = null;
            }
            addLogEntry("SOS broadcasting stopped.");
            toast({
                title: "Drone SOS Deactivated",
                description: "You are no longer broadcasting an emergency signal.",
            });
        }
    };
    
    const sendBroadcast = () => {
        const sosPacket = {
            id: 'device-prototype-123',
            latitude: location?.latitude,
            longitude: location?.longitude,
            timestamp: new Date().toISOString(),
            battery: battery,
            motion: isMoving ? 'moving' : 'still',
            status: "SOS – Drone Pickup Required"
        };

        console.log("Broadcasting SOS Packet:", sosPacket);
        setBroadcastCount(prev => prev + 1);
        addLogEntry(`SOS signal #${broadcastCount + 1} sent.`);
    }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
       <header className="sticky top-0 z-40 w-full p-4 flex justify-between items-center">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" disabled={isBroadcasting}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Drone SOS Mode</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-6 w-6" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>How Drone SOS Works</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground space-y-2 pt-2">
                <p>• Keep Bluetooth ON. Your phone uses it to send signals.</p>
                <p>• A distress signal is sent every 5 seconds to nearby drones.</p>
                <p>• This works even if you have no internet or cell service.</p>
                <p>• Keep your phone as charged as possible to extend signal life.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Activate Drone SOS</CardTitle>
                 <Switch
                    checked={isBroadcasting}
                    onCheckedChange={handleBroadcastToggle}
                    className="data-[state=checked]:bg-red-600"
                    aria-label="Activate Drone SOS Toggle"
                />
            </CardHeader>
             <CardContent>
                {isBroadcasting ? (
                    <div className="flex items-center gap-3 text-red-400">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </div>
                        <p className="font-semibold">Broadcasting SOS – Waiting for Drone Pickup…</p>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Turn on to start sending distress signals to rescue drones.</p>
                )}
            </CardContent>
        </Card>

        <div className={cn("space-y-6 transition-opacity", isBroadcasting ? 'opacity-50 pointer-events-none' : '')}>
            <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                    <CardTitle>Silent Mode</CardTitle>
                    <CardDescription>Enable to send signals without sound or vibration.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                     <Label htmlFor="silent-mode" className="text-base">Enable Silent SOS</Label>
                    <Switch id="silent-mode" checked={isSilent} onCheckedChange={setIsSilent} />
                </CardContent>
            </Card>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
                <CardTitle>SOS Status Log</CardTitle>
                <CardDescription>Real-time updates on your broadcast.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold">Signals Sent:</p>
                    <p className="font-mono p-1 bg-gray-700/50 rounded-md">{broadcastCount}</p>
                </div>
                 <div className="p-3 bg-black/30 rounded-lg font-mono text-xs h-32 overflow-y-auto">
                    {log.length > 0 ? log.map((entry, i) => <p key={i}>{entry}</p>) : <p className="text-gray-500">Awaiting activation...</p>}
                 </div>
            </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader><CardTitle>Fallback Data</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold flex items-center gap-2"><MapPin size={16} /> Location Sent</p>
                    <p className="font-mono text-xs">{location ? `${location.latitude}, ${location.longitude}` : 'Unavailable'}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold flex items-center gap-2"><Battery size={16}/> Phone Battery</p>
                    <p className="font-mono">{battery !== null ? `${battery}%` : 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold flex items-center gap-2"><Rss size={16}/> Motion Status</p>
                    <p className="font-mono">{isMoving ? 'Moving' : 'Still'}</p>
                </div>
                <div className="relative w-full h-24 rounded-lg overflow-hidden mt-4">
                    <Image src="https://placehold.co/600x400" layout="fill" objectFit="cover" alt="Map Snippet" className="opacity-30" data-ai-hint="satellite map" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CircleDotDashed className="text-blue-400 h-8 w-8 animate-spin" />
                    </div>
                </div>
            </CardContent>
        </Card>

      </main>

      <footer className="p-4">
        {isBroadcasting && (
          <Button
            variant="destructive"
            size="lg"
            className="w-full text-lg h-14"
            onClick={() => handleBroadcastToggle(false)}
          >
            Stop Drone SOS
          </Button>
        )}
      </footer>
    </div>
  );
}
