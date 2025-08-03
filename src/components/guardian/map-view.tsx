'use client';

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, User, Users } from "lucide-react";

export function MapView() {
  return (
    <div className="p-4 md:p-6 h-full bg-slate-50 dark:bg-gray-900/50">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campus Crowd Visualization</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Users className="h-4 w-4" /> 125 Active</div>
            <div className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> 118 Safe</div>
            <div className="flex items-center gap-1"><AlertCircle className="h-4 w-4 text-red-500" /> 7 Needs Help</div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This is a simulated map view. User locations are randomly generated for demonstration purposes.
          </p>
          <div className="relative w-full h-[60vh] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border">
             <Image
                src="https://placehold.co/1200x800.png"
                alt="Campus Map"
                layout="fill"
                objectFit="cover"
                data-ai-hint="campus map"
              />
            {/* Simulated user markers */}
            <div className="absolute top-[20%] left-[30%] opacity-0 animate-pop-in" style={{ animationDelay: '100ms' }}>
                <User className="h-6 w-6 text-blue-500 bg-white rounded-full p-1 shadow-lg" />
            </div>
            <div className="absolute top-[50%] left-[50%] opacity-0 animate-pop-in" style={{ animationDelay: '200ms' }}>
                <User className="h-6 w-6 text-blue-500 bg-white rounded-full p-1 shadow-lg" />
            </div>
            <div className="absolute top-[45%] left-[55%] opacity-0 animate-pop-in" style={{ animationDelay: '300ms' }}>
                <User className="h-6 w-6 text-green-500 bg-white rounded-full p-1 shadow-lg" />
            </div>
             <div className="absolute top-[60%] left-[25%] opacity-0 animate-pop-in" style={{ animationDelay: '400ms' }}>
                <User className="h-6 w-6 text-green-500 bg-white rounded-full p-1 shadow-lg" />
            </div>
            <div className="absolute top-[70%] left-[70%] opacity-0 animate-pop-in" style={{ animationDelay: '500ms' }}>
                <User className="h-6 w-6 text-yellow-500 bg-white rounded-full p-1 shadow-lg animate-pulse" />
            </div>
             <div className="absolute top-[30%] left-[65%]">
                <User className="h-6 w-6 text-red-500 bg-white rounded-full p-1 shadow-lg animate-ping" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
