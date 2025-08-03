
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PhoneOutgoing } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function SOSButton() {
  const [isSilent, setIsSilent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendSOS = () => {
    setIsSending(true);
    // Simulate sending SOS
    setTimeout(() => {
      toast({
        title: 'SOS Alert Sent',
        description: `Your emergency alert has been broadcasted ${isSilent ? 'silently' : 'loudly'}. Your location has been shared.`,
        variant: 'destructive',
      });
      setIsSending(false);
      setIsDialogOpen(false);
    }, 1500);
  };
  
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          variant="destructive"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl flex items-center justify-center gap-2 animate-pulse"
        >
          <PhoneOutgoing className="h-8 w-8" />
          <span className="sr-only">SOS</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-2xl">
            <PhoneOutgoing className="mr-2 h-8 w-8 text-destructive" /> Confirm Emergency SOS
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base py-4">
            This will immediately send an emergency alert with your current location to all nearby users and your trusted contacts. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2 my-4 p-4 bg-muted rounded-lg">
          <Switch id="silent-mode" checked={isSilent} onCheckedChange={setIsSilent} />
          <Label htmlFor="silent-mode" className="flex-1">
            <p className="font-medium">Silent SOS Mode</p>
            <p className="text-sm text-muted-foreground">Trigger alert without sound or vibration on your device.</p>
          </Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSending}
            onClick={handleSendSOS}
            className={cn(
              "bg-destructive hover:bg-destructive/90",
              isSending && "bg-destructive/50"
            )}
          >
            {isSending ? 'Sending...' : 'Yes, Send Alert'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
