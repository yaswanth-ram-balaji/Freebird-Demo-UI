'use client';

import * as React from 'react';
import type { Chat, User, Message } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, Smile, Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


type ChatViewProps = {
  chat: Chat;
  users: User[];
  currentUser: User;
  onSendMessage: (text: string) => void;
};

export function ChatView({ chat, users, currentUser, onSendMessage }: ChatViewProps) {
  const [message, setMessage] = React.useState('');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [chat.messages]);

  const getSender = (senderId: string): User => {
    const user = users.find(u => u.id === senderId);
    if(user && user.id === currentUser.id && currentUser.anonymous){
        return { ...currentUser, name: 'Anonymous', avatar: 'https://i.pravatar.cc/150?u=anonymous' };
    }
    if (user?.anonymous) {
        return { ...user, name: 'Anonymous', avatar: 'https://i.pravatar.cc/150?u=anonymous' };
    }
    return user || { id: 'unknown', name: 'Unknown', avatar: '', status: 'online', anonymous: false };
  };

  const getChatDetails = () => {
    if (chat.type === 'private') {
      const otherUserId = chat.participants.find(p => p !== currentUser.id);
      return getSender(otherUserId!);
    }
    return { name: chat.name, avatar: '', fallback: chat.name?.charAt(0) || 'G' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText('HACK-2024');
    toast({
      title: 'Room Code Copied!',
      description: 'The code HACK-2024 has been copied to your clipboard.',
    });
  }

  const chatDetails = getChatDetails();

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-4 border-b bg-card">
        <Avatar className="h-10 w-10">
          <AvatarImage src={chatDetails.avatar} />
          <AvatarFallback>{chatDetails.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{chatDetails.name}</h3>
          <p className="text-sm text-muted-foreground">{chat.type === 'group' ? `${chat.participants.length} members` : 'Direct Message'}</p>
        </div>
        {chat.type === 'group' && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">Room Code: HACK-2024</Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </header>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-6">
          {chat.messages.map((msg, index) => {
            const sender = getSender(msg.senderId);
            const isCurrentUser = sender.id === currentUser.id;
            const isAdminMessage = sender.name === 'Campus Security' || msg.text.startsWith('[ADMIN]');
            
            if(isAdminMessage) {
              return (
                <div key={msg.id} className="text-center text-xs text-muted-foreground my-4 flex items-center gap-2 animate-in fade-in duration-500">
                  <div className="flex-1 border-t"></div>
                  <span>{msg.text.replace('[ADMIN]', '')}</span>
                  <div className="flex-1 border-t"></div>
                </div>
              )
            }

            return (
              <div
                key={msg.id}
                className={cn('flex items-end gap-3 animate-in fade-in-50 duration-500', isCurrentUser ? 'justify-end' : 'justify-start')}
              >
                {!isCurrentUser && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={sender.avatar} />
                            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{sender.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <div
                  className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl relative group',
                    isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none border'
                  )}
                >
                  {!isCurrentUser && <p className="text-xs font-semibold text-primary mb-1">{sender.name}</p>}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs mt-1 text-right opacity-70">{msg.timestamp}</p>
                  <button className="absolute -bottom-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><Smile size={16} className="text-muted-foreground hover:text-foreground"/></button>
                </div>
                {isCurrentUser && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={sender.avatar} />
                            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{sender.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <footer className="p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Button variant="ghost" size="icon" type="button"><Smile className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" type="button"><Paperclip className="h-5 w-5" /></Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
