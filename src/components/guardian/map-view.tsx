
'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, ShieldQuestion, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const LegendItem = ({ className, icon, label }: { className: string, icon: React.ReactNode, label: string }) => (
    <div className="flex items-center gap-2">
        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", className)}>
            {icon}
        </div>
        <span className="text-xs font-medium">{label}</span>
    </div>
);


export function MapView() {
  return (
    <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
             <Image
                src="https://placehold.co/1200x800.png"
                alt="Campus Map"
                layout="fill"
                objectFit="cover"
                className="opacity-50 dark:opacity-30"
                data-ai-hint="dark satellite map"
              />
        </div>

        {/* Floating Info Card */}
        <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96">
            <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-lg animate-in fade-in-50 duration-500">
                <CardHeader>
                    <CardTitle>Campus Crowd Visualization</CardTitle>
                    <CardDescription>Live user status on campus.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                   <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-bold text-lg">125</p>
                            <p className="text-muted-foreground text-xs">Active Users</p>
                        </div>
                   </div>
                   <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="font-bold text-lg">118</p>
                            <p className="text-muted-foreground text-xs">Safe</p>
                        </div>
                   </div>
                   <div className="flex items-center gap-2">
                        <ShieldQuestion className="h-5 w-5 text-yellow-500" />
                        <div>
                            <p className="font-bold text-lg">6</p>
                            <p className="text-muted-foreground text-xs">Need Help</p>
                        </div>
                   </div>
                   <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="font-bold text-lg">1</p>
                            <p className="text-muted-foreground text-xs">In Danger</p>
                        </div>
                   </div>
                </CardContent>
            </Card>
        </div>

        {/* Map Legend */}
         <div className="absolute bottom-4 left-4">
            <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-lg p-2 animate-in fade-in-50 duration-500">
                <div className="flex items-center gap-4">
                    <LegendItem className="bg-green-500/30 text-green-700 dark:text-green-300" icon={<CheckCircle size={10} />} label="Safe" />
                    <LegendItem className="bg-yellow-500/30 text-yellow-700 dark:text-yellow-300" icon={<ShieldQuestion size={10} />} label="Help" />
                    <LegendItem className="bg-red-500/30 text-red-700 dark:text-red-300" icon={<AlertTriangle size={10} />} label="Danger" />
                </div>
            </Card>
        </div>


        {/* Simulated user markers */}
        <div className="absolute top-[20%] left-[30%] opacity-0 animate-pop-in" style={{ animationDelay: '100ms' }}>
            <User className="h-6 w-6 text-blue-500 bg-white/80 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[50%] left-[50%] opacity-0 animate-pop-in" style={{ animationDelay: '200ms' }}>
            <User className="h-6 w-6 text-blue-500 bg-white/80 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[45%] left-[55%] opacity-0 animate-pop-in" style={{ animationDelay: '300ms' }}>
            <User className="h-6 w-6 text-green-500 bg-white/80 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[60%] left-[25%] opacity-0 animate-pop-in" style={{ animationDelay: '400ms' }}>
            <User className="h-6 w-6 text-green-500 bg-white/80 rounded-full p-1 shadow-lg" />
        </div>
        <div className="absolute top-[70%] left-[70%] opacity-0 animate-pop-in" style={{ animationDelay: '500ms' }}>
            <User className="h-6 w-6 text-yellow-500 bg-white/80 rounded-full p-1 shadow-lg animate-pulse" />
        </div>
        <div className="absolute top-[30%] left-[65%]">
            <User className="h-6 w-6 text-red-500 bg-white/80 rounded-full p-1 shadow-lg animate-ping" />
        </div>
    </div>
  )
}
