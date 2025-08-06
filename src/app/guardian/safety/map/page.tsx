
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapView } from '@/components/guardian/map-view';

export default function EmergencyMapPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="absolute top-0 left-0 z-20 p-4">
        <Link href="/guardian/safety" passHref>
          <Button variant="ghost" size="icon" className="bg-background/50 hover:bg-background/80 backdrop-blur-sm">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      <main className="flex-1">
        <MapView />
      </main>
    </div>
  );
}
