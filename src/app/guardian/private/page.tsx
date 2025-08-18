
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, MessageSquarePlus, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { currentUser as initialUser, users as allUsers, chats as initialChats } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/lib/data';
import { useStatus } from '@/context/status-provider';

const statusColors: Record<UserType['status'], string> = {
    safe: 'bg-green-500',
    help: 'bg-yellow-500',
    danger: 'bg-red-500',
    online: 'bg-gray-400',
};

const statusText: Record<UserType['status'], string> = {
    safe: 'Safe',
    help: 'Needs Help',
    danger: 'In Danger',
    online: 'Online',
};

export default function PrivateChatPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { currentUser } = useStatus();

  const otherUsers = allUsers.filter(u => u.id !== currentUser.id && u.name !== 'Admin');

  const handleRequestChat = (userName: string) => {
    toast({
      title: 'Chat Request Sent',
      description: `Your request to chat with ${userName} has been sent.`,
    });
  };
  
  const existingPrivateChats = initialChats.filter(c => c.type === 'private' && c.participants.includes(currentUser.id));
  const existingChatPartners = existingPrivateChats.flatMap(c => c.participants).filter(pId => pId !== currentUser.id);
  
  const handleStartChat = (userId: string) => {
      const chat = existingPrivateChats.find(c => c.participants.includes(userId));
      if (chat) {
          router.push(`/guardian/rooms?chatId=${chat.id}`);
      } else {
        // This case should ideally not happen if the button is shown correctly.
         toast({ title: 'Error', description: 'Chat not found.', variant: 'destructive' });
      }
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
          <h1 className="ml-4 text-xl font-bold">Start a Private Chat</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users />
                    Available Users
                </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
                {otherUsers.map(user => {
                    const hasChat = existingChatPartners.includes(user.id);
                    return (
                        <div key={user.id} className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                     <span className={cn('absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-card', statusColors[user.status])} title={statusText[user.status]} />
                                </div>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <Badge variant={user.status === 'danger' ? 'destructive' : 'outline'}>{statusText[user.status]}</Badge>
                                </div>
                            </div>
                            {hasChat ? (
                                <Button onClick={() => handleStartChat(user.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4"/>
                                    Chat
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={() => handleRequestChat(user.name)}>
                                    <MessageSquarePlus className="mr-2 h-4 w-4"/>
                                    Request Chat
                                </Button>
                            )}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
