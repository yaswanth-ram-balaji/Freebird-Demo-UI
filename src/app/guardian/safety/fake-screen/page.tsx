
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wifi, Signal, BatteryFull, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function FakeScreenPage() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [isSosSubtlyActive, setIsSosSubtlyActive] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', ''));
            setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000 * 60); // Update every minute

        // Subtle SOS activation trigger
        const sosTimer = setTimeout(() => {
            setIsSosSubtlyActive(true);
            toast({
                title: "Silent SOS Active",
                description: "The fake screen is on. Silent alerts are being sent in the background.",
                variant: 'destructive'
            });
        }, 3000); // Activate after 3 seconds

        return () => {
            clearInterval(intervalId);
            clearTimeout(sosTimer);
        };
    }, [toast]);

    return (
        <div className="relative flex flex-col h-screen w-screen text-white overflow-hidden">
            <Image
                src="https://placehold.co/1080x1920"
                alt="Lock screen wallpaper"
                layout="fill"
                objectFit="cover"
                className="z-0"
                data-ai-hint="nature wallpaper"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />

            <div className="relative z-20 flex flex-col h-full p-8">
                {/* Status Bar */}
                <div className="flex justify-end items-center gap-2 text-sm">
                    <Signal size={16} />
                    <Wifi size={16} />
                    <BatteryFull size={20} />
                </div>

                {isSosSubtlyActive && (
                     <div className="absolute top-16 left-4 right-4">
                        <Alert variant="destructive" className="bg-red-900/50 border-red-500/30 text-white animate-pulse">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <AlertTitle className="font-bold text-red-300">SILENT SOS ACTIVE</AlertTitle>
                          <AlertDescription>
                            Broadcasting location to trusted contacts.
                          </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center items-center text-center -mt-16">
                    <div className="text-7xl font-thin tracking-tighter" suppressHydrationWarning>
                        {time || '00:00'}
                    </div>
                    <div className="text-xl font-medium mt-1" suppressHydrationWarning>
                        {date || 'Loading...'}
                    </div>
                </div>

                {/* Unlock prompt */}
                <div className="flex flex-col items-center">
                    <p className="text-lg font-medium">Swipe up to unlock</p>
                </div>
            </div>
        </div>
    );
}
