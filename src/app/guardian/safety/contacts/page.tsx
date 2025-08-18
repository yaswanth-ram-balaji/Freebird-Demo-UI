
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'guardianlink-trusted-contacts';

type Contact = {
    id: string;
    name: string;
    avatar: string;
    phone: string;
};

const initialContacts: Contact[] = [
    { id: 'contact1', name: 'Mom', avatar: 'https://i.pravatar.cc/150?u=mom', phone: '111-222-3333' },
    { id: 'contact2', name: 'Best Friend', avatar: 'https://i.pravatar.cc/150?u=friend', phone: '444-555-6666' },
    { id: 'contact3', name: 'Roommate', avatar: 'https://i.pravatar.cc/150?u=roommate', phone: '777-888-9999' }
];

export default function TrustedContactsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [contacts, setContacts] = React.useState<Contact[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [newContactName, setNewContactName] = React.useState('');
    const [newContactPhone, setNewContactPhone] = React.useState('');
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        try {
            const storedContacts = localStorage.getItem(STORAGE_KEY);
            if (storedContacts) {
                setContacts(JSON.parse(storedContacts));
            } else {
                setContacts(initialContacts);
            }
        } catch (error) {
            console.error("Failed to load contacts from localStorage", error);
            setContacts(initialContacts);
        }
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
            } catch (error) {
                console.error("Failed to save contacts to localStorage", error);
            }
        }
    }, [contacts, isMounted]);

    const handleAddContact = () => {
        if (!newContactName.trim() || !newContactPhone.trim()) {
            toast({ title: 'Name and phone cannot be empty', variant: 'destructive' });
            return;
        }

        const newContact: Contact = {
            id: `contact-${Date.now()}`,
            name: newContactName,
            phone: newContactPhone,
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        };

        setContacts(prev => [...prev, newContact]);
        toast({ title: `Contact "${newContactName}" added.` });
        setNewContactName('');
        setNewContactPhone('');
        setIsAddDialogOpen(false);
    };

    const handleDeleteContact = (contactId: string, contactName: string) => {
        setContacts(prev => prev.filter(c => c.id !== contactId));
        toast({
            title: 'Contact Deleted',
            description: `"${contactName}" has been removed from your trusted contacts.`,
        });
    };

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
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Trusted Contacts</h1>
           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                            <Input id="name" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder="e.g. Jane Doe" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" type="tel" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder="e.g. 555-123-4567" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleAddContact}>Add Contact</Button>
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
            {isMounted && contacts.map(contact => (
                <Card key={contact.id}>
                    <CardContent className="p-4 flex items-center gap-4 group">
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
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently remove <span className="font-bold">{contact.name}</span> from your trusted contacts.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            variant="destructive"
                                            onClick={() => handleDeleteContact(contact.id, contact.name)}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            ))}
             {isMounted && contacts.length === 0 && (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">No Trusted Contacts</h3>
                    <p>Add your first trusted contact using the "Add New" button.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
