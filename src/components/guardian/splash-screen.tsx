
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';
import { SparklesText } from '@/components/ui/sparkles-text';

export const SplashScreen = ({ onFinished }: { onFinished: () => void }) => {
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationStep(1), 2000), // Network loss
            setTimeout(() => setAnimationStep(2), 3000), // Bird flies in
            setTimeout(() => setAnimationStep(3), 5000), // Bird flies out
            setTimeout(() => setAnimationStep(4), 7000), // Logo reveal
            setTimeout(() => setAnimationStep(5), 8000), // Typing animation start
            setTimeout(onFinished, 14000), // Total duration + pause
        ];
        return () => timers.forEach(clearTimeout);
    }, [onFinished]);

    return (
        <div className={cn("flex flex-col items-center justify-center h-screen w-screen bg-primary text-primary-foreground fixed inset-0 z-50 transition-opacity duration-1000")}>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Step 0, 1 & 2: Network Symbol */}
                <div className={cn("absolute transition-opacity duration-500", (animationStep >= 2 && animationStep < 3) ? 'opacity-100' : (animationStep >=3 ? 'opacity-0' : 'opacity-100'))}>
                     {animationStep < 1 && <Wifi className="w-24 h-24 text-primary-foreground/80 animate-pulse" />}
                     {animationStep >= 1 && <WifiOff className="w-24 h-24 text-red-400" />}
                </div>

                {/* Step 2: Bird flies in */}
                <div 
                    className={cn(
                        "absolute left-1/2 top-1/2 text-5xl",
                        animationStep === 2 ? "animate-fly-in-from-br" : "opacity-0"
                    )}
                >
                    <span>🕊️</span>
                </div>
                
                 {/* Step 3: Bird flies out with symbol */}
                 <div
                     className={cn(
                        "absolute left-1/2 top-1/2",
                        animationStep >= 3 ? "animate-fly-out-to-tl" : "opacity-0"
                     )}
                 >
                     <div className="flex items-center text-4xl">
                         <span>🕊️</span>
                         <WifiOff className="w-8 h-8 text-red-400 ml-[-10px] mt-2" />
                     </div>
                 </div>

                {/* Step 4 & 5: Final Logo and Text */}
                 <div className={cn("flex flex-col items-center justify-center text-center transition-opacity duration-1000", animationStep >= 4 ? 'opacity-100' : 'opacity-0')}>
                    <div className="flex flex-col items-center animate-pop-in">
                        <span className="text-7xl">🕊️</span>
                        <SparklesText
                          text="FreeBird"
                          className="text-7xl font-bold tracking-tight font-headline"
                          colors={{ first: '#FFFFFF', second: '#87CEEB' }}
                          sparklesCount={20}
                        />
                    </div>
                    <div className="mt-4 text-2xl text-primary-foreground/80 font-tagline">
                        {animationStep >= 5 && (
                          <div className="animate-typing inline-block whitespace-nowrap overflow-hidden font-serif">
                            <span>When the internet </span>
                            <span className="text-red-400">dies, </span>
                            <span>FreeBird </span>
                            <span className="text-green-400">flies.</span>
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
