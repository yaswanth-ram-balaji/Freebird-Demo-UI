
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Phone, MessageSquare, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const trustedContacts = [
    { id: 'contact1', name: 'Mom', avatar: 'https://i.pravatar.cc/150?u=mom', phone: '111-222-3333' },
    { id: 'contact2', name: 'Best Friend', avatar: 'https://i.pravatar.cc/150?u=friend', phone: '444-555-6666' },
    { id: 'contact3', name: 'Roommate', avatar: 'https://i.pravatar.cc/150?u=roommate', phone: '777-888-9999' }
];

export default function TrustedContactsPage() {
    const { toast } = useToast();

    const handleAction = (action: string, name: string) => {
        toast({
            title: `${action} Contact`,
            description: `This functionality is for demonstration. You clicked ${action.toLowerCase()} for ${name}.`
        });
    }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          <Link href="/guardian/safety" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Trusted Contacts</h1>
           <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a new Trusted Contact</DialogTitle>
                        <DialogDescription>
                           Enter the details of the person you trust. They will be notified in an emergency.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" placeholder="e.g. Jane Doe" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" type="tel" placeholder="e.g. 555-123-4567" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={() => toast({title: "Contact Added", description: "This is a demo. The contact has not been saved."})}>Add Contact</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-2xl mx-auto space-y-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                    <CardTitle>What is a Trusted Contact?</CardTitle>
                    <CardDescription className="text-blue-900 dark:text-blue-200">
                        Trusted contacts are the people who will receive your SOS alerts. Add up to 5 people you trust completely. These contacts are stored locally on your device for offline use.
                    </CardDescription>
                </CardHeader>
            </Card>
            {trustedContacts.map(contact => (
                <Card key={contact.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-bold text-lg">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Call', contact.name)}>
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Message', contact.name)}>
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" onClick={() => handleAction('Edit', contact.name)}>
                                <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                             <Button variant="ghost" size="icon" onClick={() => handleAction('Delete', contact.name)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
