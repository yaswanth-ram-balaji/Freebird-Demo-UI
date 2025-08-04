
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currentUser } from '@/lib/data';
import { useAnonymity } from '@/context/anonymity-provider';
import { useToast } from '@/hooks/use-toast';

export default function SyncContactsPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const { isAnonymous } = useAnonymity();
  const { toast } = useToast();

  React.useEffect(() => {
    if (canvasRef.current) {
      const userIdentifier = isAnonymous ? `anonymous-${currentUser.id}` : currentUser.id;
      QRCode.toCanvas(canvasRef.current, userIdentifier, { width: 256, margin: 2 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [isAnonymous]);
  
  const handleScan = () => {
    toast({
        title: 'Feature Not Implemented',
        description: 'Camera QR code scanning is not yet available in this prototype.',
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Sync Contacts</h1>
          <div className="w-8"></div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your QR Code</CardTitle>
            <CardDescription>Have others scan this code to add you as a contact.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-8">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <canvas ref={canvasRef} />
            </div>
            <div className="text-center">
                <p className="font-semibold text-lg">{isAnonymous ? 'Anonymous' : currentUser.name}</p>
                <p className="text-sm text-muted-foreground">Your unique ID will be shared.</p>
            </div>
            <Button className="w-full" onClick={handleScan}>
              <Camera className="mr-2 h-5 w-5" />
              Scan a Code
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
