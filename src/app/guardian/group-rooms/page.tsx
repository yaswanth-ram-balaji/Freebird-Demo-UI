
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Hash, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { currentUser, users, type Chat } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const STORAGE_KEY = 'guardianlink-group-chats';

export default function GroupRoomsPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [groupChats, setGroupChats] = React.useState<Chat[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = React.useState(false);
  const [newRoomName, setNewRoomName] = React.useState('');
  const [joinRoomCode, setJoinRoomCode] = React.useState('');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
        const storedChats = localStorage.getItem(STORAGE_KEY);
        if (storedChats) {
            setGroupChats(JSON.parse(storedChats));
        }
    } catch (error) {
        console.error("Failed to load chats from localStorage", error);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(groupChats));
        } catch (error) {
            console.error("Failed to save chats to localStorage", error);
        }
    }
  }, [groupChats, isMounted]);


  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
        toast({ title: 'Room name cannot be empty', variant: 'destructive'});
        return;
    }

    const newRoom: Chat = {
        id: `chat-${Date.now()}`,
        type: 'group',
        name: newRoomName,
        participants: [currentUser.id],
        messages: [],
        lastMessage: 'Room created',
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', ''),
        code: generateRoomCode(),
        createdAt: new Date(),
    };

    setGroupChats(prev => [...prev, newRoom]);
    toast({ title: `Room "${newRoomName}" created!`, description: `Share the code ${newRoom.code} to invite others.` });
    setNewRoomName('');
    setIsCreateDialogOpen(false);
  };

  const handleJoinRoom = () => {
    if (!joinRoomCode.trim()) {
        toast({ title: 'Please enter a room code', variant: 'destructive'});
        return;
    }
    // In a real app, you'd validate the code against a backend.
    // For this prototype, we'll just show a success message.
     toast({ title: `Joined room!`, description: `You have successfully joined the room with code ${joinRoomCode}.` });
     setJoinRoomCode('');
     setIsJoinDialogOpen(false);
  }
  
  const handleDeleteRoom = (roomId: string, roomName?: string) => {
    setGroupChats(prev => prev.filter(chat => chat.id !== roomId));
    toast({
        title: 'Room Deleted',
        description: `The room "${roomName}" has been successfully deleted.`,
        variant: 'destructive',
    })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex items-center h-16 px-4 mx-auto md:px-6">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="ml-4">
            <h1 className="text-xl font-bold">Rooms</h1>
            <p className="text-sm text-muted-foreground">Private communication spaces</p>
          </div>
        </div>
      </header>

       <div className="p-4 bg-background border-b">
         <div className="container mx-auto flex items-center justify-stretch gap-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="flex-1">
                        <Plus className="mr-2 h-4 w-4" /> Create Room
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new Room</DialogTitle>
                        <DialogDescription>
                            Give your new room a name. A unique 6-digit code will be generated for others to join.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} className="col-span-3" placeholder="e.g. Maths Study Group" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleCreateRoom}>Create Room</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                        <Hash className="mr-2 h-4 w-4" /> Join Room
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Join an existing room</DialogTitle>
                        <DialogDescription>
                           Enter the 6-digit code for the room you want to join.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">Code</Label>
                            <Input id="code" value={joinRoomCode} onChange={(e) => setJoinRoomCode(e.target.value)} className="col-span-3" placeholder="e.g. NPHL5U" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleJoinRoom}>Join Room</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
         </div>
       </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="container mx-auto space-y-4">
            {isMounted && groupChats.map(chat => (
                <div key={chat.id} className="group flex items-center gap-2">
                    <Link href={`/guardian/rooms?chatId=${chat.id}`} className="flex-1">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">{chat.name}</p>
                                    <p className="text-sm text-muted-foreground">{chat.participants.length} participants</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <Badge variant="outline">{chat.code}</Badge>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Created {chat.createdAt ? new Date(chat.createdAt).toLocaleDateString() : 'recently'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the room
                                    <span className="font-bold"> {chat.name}</span> and remove all associated messages.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRoom(chat.id, chat.name)}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ))}
            {isMounted && groupChats.length === 0 && (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">No Rooms Yet</h3>
                    <p>Get started by creating a new room or joining an existing one.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
