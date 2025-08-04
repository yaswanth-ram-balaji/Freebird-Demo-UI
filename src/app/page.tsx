
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, Users, Settings, Ghost, Wifi, WifiOff, MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { SparklesText } from '@/components/ui/sparkles-text';
import { SOSButton } from '@/components/guardian/sos-button';
import { useAnonymity } from '@/context/anonymity-provider';

const SplashScreen = ({ onFinished }: { onFinished: () => void }) => {
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setAnimationStep(1), 2000), // Network loss
            setTimeout(() => setAnimationStep(2), 3000), // Bird flies in
            setTimeout(() => setAnimationStep(3), 5000), // Bird flies out
            setTimeout(() => setAnimationStep(4), 7000), // Logo reveal
            setTimeout(() => setAnimationStep(5), 8000), // Typing animation start
            setTimeout(() => setAnimationStep(6), 12000), // Subtitle reveal
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

                {/* Step 4, 5 & 6: Final Logo and Text */}
                 <div className={cn("flex flex-col items-center justify-center text-center transition-opacity duration-1000", animationStep >= 4 ? 'opacity-100' : 'opacity-0')}>
                    <div className="flex flex-col items-center animate-pop-in">
                        <span className="text-7xl">🕊️</span>
                        <SparklesText
                          text="GuardianLink"
                          className="text-7xl font-bold tracking-tight font-headline"
                          colors={{ first: '#FFFFFF', second: '#87CEEB' }}
                          sparklesCount={20}
                        />
                    </div>
                    <div className="mt-4 text-2xl text-primary-foreground/80 font-tagline">
                        {animationStep >= 5 && (
                          <div className="animate-typing inline-block whitespace-nowrap overflow-hidden font-serif">
                            <span className="text-white">When the internet </span>
                            <span className="text-red-400">dies, </span>
                            <span className="text-white">GuardianLink </span>
                            <span className="text-green-400">connects.</span>
                          </div>
                        )}
                    </div>
                     <div className={cn("mt-4 text-sm text-primary-foreground/60 transition-opacity duration-1000", animationStep >= 6 ? 'opacity-100' : 'opacity-0')}>
                        (Offline features are currently in simulation)
                    </div>
                </div>
            </div>
        </div>
    );
};


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


export default function GuardianLinkPage() {
  const { isAnonymous, setIsAnonymous } = useAnonymity();
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
            <h1 className="text-3xl font-bold tracking-tight font-headline">GuardianLink</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-6 h-6" />
              </Button>
            </Link>
             <Link href="/guardian/rooms">
              <Button variant="ghost" size="icon">
                <Users className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="container px-4 mx-auto md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Stay Connected, Stay Safe</h2>
            <p className="mt-2 text-lg text-muted-foreground">Your reliable off-grid communication tool.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 place-items-stretch">
             <FeatureCard 
                href="/guardian/safety"
                icon={Shield}
                title="Women's Safety"
                description="Secure communication and emergency features"
              />
             <FeatureCard
                href="/guardian/sos"
                icon={AlertTriangle}
                title="Emergency"
                description="Instant SOS alerts and emergency response"
                isEmergency
              />
              <FeatureCard
                href="/guardian/broadcast"
                icon={MessageSquare}
                title="Public Broadcast"
                description="Send a message to all nearby users"
              />
              <FeatureCard
                href="/guardian/private"
                icon={Lock}
                title="Private Chat"
                description="Request-based direct messaging"
              />
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-50">
        <Button 
          variant="outline"
          size="icon"
          className="w-14 h-14 rounded-full bg-background border-2 shadow-lg"
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <Ghost className={cn("h-7 w-7 transition-colors", isAnonymous ? 'text-primary' : 'text-muted-foreground')} />
        </Button>
        
        <SOSButton />
      </div>
    </div>
  );
}
