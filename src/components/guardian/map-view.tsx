
'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, ShieldQuestion, User, Users, Hospital, Shield, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const LegendItem = ({ className, icon, label, count }: { className: string, icon: React.ReactNode, label: string, count: number }) => (
    <div className="flex flex-col items-center text-center">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-1", className)}>
            {icon}
        </div>
        <p className="text-xs font-bold">{count}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
    </div>
);

const SafeZoneMarker = ({ icon, label, position, delay }: { icon: React.ReactNode, label: string, position: string, delay: string }) => (
    <div className={cn("absolute opacity-0 animate-pop-in", position)} style={{ animationDelay: delay }}>
        <div className="relative group">
            <div className="absolute -inset-2 rounded-full bg-blue-500/30 animate-pulse" style={{animationDelay: delay}}></div>
            <div className="relative w-12 h-12 rounded-full bg-blue-500/80 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border-2 border-blue-400">
                {icon}
            </div>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-background text-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
            </div>
        </div>
    </div>
)

export function MapView() {
  return (
    <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
             <Image
                src="https://placehold.co/1200x800"
                alt="Campus Map"
                layout="fill"
                objectFit="cover"
                className="opacity-20 dark:opacity-20"
                data-ai-hint="dark satellite map"
              />
        </div>

        {/* Floating Info Panel at the bottom */}
        <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-background/70 backdrop-blur-sm border-border/30 shadow-2xl animate-in fade-in-50 duration-700 w-full max-w-md mx-auto">
                <CardHeader className="pb-4">
                    <CardTitle>Live Campus Status</CardTitle>
                    <CardDescription>Real-time user locations and safety alerts</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-around">
                   <LegendItem className="bg-green-500/20 text-green-400" icon={<CheckCircle size={20} />} label="Safe" count={118} />
                   <LegendItem className="bg-yellow-500/20 text-yellow-400" icon={<ShieldQuestion size={20} />} label="Help" count={6} />
                   <LegendItem className="bg-red-500/20 text-red-400" icon={<AlertTriangle size={20} />} label="Danger" count={1} />
                   <LegendItem className="bg-gray-500/20 text-gray-400" icon={<Users size={20} />} label="Total" count={125} />
                </CardContent>
            </Card>
        </div>


        {/* Simulated user markers */}
        <div className="absolute top-[20%] left-[30%] opacity-0 animate-pop-in" style={{ animationDelay: '100ms' }}>
            <User className="h-6 w-6 text-green-400 bg-background/50 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[50%] left-[50%] opacity-0 animate-pop-in" style={{ animationDelay: '200ms' }}>
            <User className="h-6 w-6 text-green-400 bg-background/50 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[45%] left-[55%] opacity-0 animate-pop-in" style={{ animationDelay: '300ms' }}>
            <User className="h-6 w-6 text-green-400 bg-background/50 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[60%] left-[25%] opacity-0 animate-pop-in" style={{ animationDelay: '400ms' }}>
            <User className="h-6 w-6 text-green-400 bg-background/50 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[70%] left-[70%] opacity-0 animate-pop-in" style={{ animationDelay: '500ms' }}>
            <User className="h-6 w-6 text-yellow-400 bg-background/50 rounded-full p-1 shadow-lg animate-pulse" />
        </div>
        <div className="absolute top-[30%] left-[65%]">
            <div className="absolute -inset-1.5 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <User className="relative h-6 w-6 text-red-400 bg-background/50 rounded-full p-1 shadow-lg" />
        </div>

        {/* Safe Zone Markers */}
        <SafeZoneMarker icon={<Shield size={24}/>} label="Police Station" position="top-[15%] left-[10%]" delay="600ms" />
        <SafeZoneMarker icon={<Hospital size={24}/>} label="Campus Health Center" position="top-[75%] left-[15%]" delay="700ms" />
        <SafeZoneMarker icon={<Building size={24}/>} label="Admin Building" position="top-[65%] left-[80%]" delay="800ms" />
    </div>
  )
}
