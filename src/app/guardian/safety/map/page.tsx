
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapView } from '@/components/guardian/map-view';

export default function EmergencyMapPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex items-center h-16 px-4 mx-auto md:px-6">
          <Link href="/guardian/safety" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Emergency Map</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <MapView />
      </main>
    </div>
  );
}
