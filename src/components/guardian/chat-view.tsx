
'use client';

import * as React from 'react';
import type { Chat, User, Message } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, Smile, Copy, Bot, MoreVertical, LogOut, Download, FileText, Image as ImageIcon, Video, Pin, MessageSquare, Files, X, Megaphone, SendHorizonal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from '@/components/ui/card';

type ChatViewProps = {
  chat: Chat;
  users: User[];
  currentUser: User;
  onSendMessage: (text: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  isAiReplying?: boolean;
};

const ReactionPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => (
  <PopoverContent className="p-1 w-auto">
    <div className="flex gap-1">
      {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
        <Button key={emoji} variant="ghost" size="icon" className="h-8 w-8 text-xl" onClick={() => onSelect(emoji)}>
          {emoji}
        </Button>
      ))}
    </div>
  </PopoverContent>
);

const QuickMessagePicker = ({ onSelect }: { onSelect: (message: string) => void }) => {
    const quickMessages = [
        "Class will start at 9 AM",
        "Assignment submitted",
        "Please check the uploaded file",
        "Meeting at library",
        "Exam date updated"
    ];
    return (
        <PopoverContent className="p-2 w-auto">
            <div className="flex flex-col gap-1">
                {quickMessages.map(msg => (
                    <Button key={msg} variant="ghost" className="justify-start" onClick={() => onSelect(msg)}>
                        {msg}
                    </Button>
                ))}
            </div>
        </PopoverContent>
    )
}

const fileIcons: Record<string, React.ReactNode> = {
    pdf: <FileText className="h-6 w-6 text-red-500" />,
    image: <ImageIcon className="h-6 w-6 text-blue-500" />,
    video: <Video className="h-6 w-6 text-green-500" />,
};

const sampleFiles = [
    { name: 'Assignment 1.pdf', type: 'pdf', size: '1.2 MB' },
    { name: 'Lab_Diagram.png', type: 'image', size: '800 KB' },
    { name: 'Lecture_Recording_short.mp4', type: 'video', size: '1.8 MB' },
    { name: 'Course_Syllabus.pdf', type: 'pdf', size: '450 KB' },
];

export function ChatView({ chat, users, currentUser, onSendMessage, onReactToMessage, isAiReplying = false }: ChatViewProps) {
  const [message, setMessage] = React.useState('');
  const [showPinned, setShowPinned] = React.useState(true);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [chat.messages, isAiReplying]);

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
    if (chat.code) {
        navigator.clipboard.writeText(chat.code);
        toast({
        title: 'Room Code Copied!',
        description: `The code ${chat.code} has been copied to your clipboard.`,
        });
    }
  }
  
  const handleLeaveRoom = () => {
      toast({
          title: 'Left Room',
          description: `You have left "${chat.name}".`,
          variant: 'destructive'
      });
      // Here you would add logic to navigate the user away or update the UI
  }
  
  const handleQuickMessageSelect = (msg: string) => {
      onSendMessage(msg);
  }

  const chatDetails = getChatDetails();

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center gap-4 p-3 border-b bg-card shadow-sm">
        <div className="flex-1 flex items-center gap-3">
             <Avatar className="h-10 w-10">
                <AvatarImage src={chatDetails.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold">{chatDetails.fallback}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-bold text-lg">{chatDetails.name}</h3>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Code:</p>
                    <Badge variant="outline" className="cursor-pointer" onClick={handleCopyCode}>
                        {chat.code || 'N/A'}
                        <Copy className="ml-2 h-3 w-3" />
                    </Badge>
                </div>
            </div>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLeaveRoom} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Leave Room</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </header>

       <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none bg-card p-0 border-b">
                <TabsTrigger value="chat" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat
                </TabsTrigger>
                <TabsTrigger value="files" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                    <Files className="mr-2 h-4 w-4" /> Files
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                 <ScrollArea className="flex-1" ref={scrollAreaRef}>
                    <div className="p-4 md:p-6 space-y-6">
                        {showPinned && (
                            <Alert className="bg-primary/10 border-primary/20 animate-in fade-in-50">
                                <Pin className="h-4 w-4 text-primary" />
                                <AlertTitle className="text-primary font-bold">Pinned Announcement</AlertTitle>
                                <AlertDescription>
                                    The final exam will be on Dec 15th. Please check the 'Files' tab for the updated syllabus.
                                </AlertDescription>
                                 <button onClick={() => setShowPinned(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary/20">
                                    <X className="h-4 w-4 text-primary/70" />
                                </button>
                            </Alert>
                        )}
                        {chat.messages.map((msg) => {
                            const sender = getSender(msg.senderId);
                            const isCurrentUser = sender.id === currentUser.id;

                            return (
                            <div
                                key={msg.id}
                                className={cn('flex items-end gap-3 animate-in fade-in-50 duration-500 group relative', isCurrentUser ? 'justify-end' : 'justify-start')}
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
                                    'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl',
                                    isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none border shadow-sm'
                                )}
                                >
                                {!isCurrentUser && <p className="text-xs font-semibold text-accent mb-1">{sender.name}</p>}
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <p className="text-xs mt-1 text-right opacity-70">{msg.timestamp}</p>
                                {msg.reactions && (
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                                        <button key={emoji} onClick={() => onReactToMessage(msg.id, emoji)} className="px-2 py-0.5 bg-background/20 dark:bg-foreground/20 rounded-full text-xs flex items-center gap-1 hover:bg-background/30">
                                        <span>{emoji}</span>
                                        <span>{count}</span>
                                        </button>
                                    ))}
                                    </div>
                                )}
                                </div>

                                <Popover>
                                <PopoverTrigger asChild>
                                    <button className={cn("absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity", isCurrentUser ? "right-10" : "left-10" )}>
                                    <Smile size={16} className="text-muted-foreground hover:text-foreground"/>
                                    </button>
                                </PopoverTrigger>
                                <ReactionPicker onSelect={(emoji) => onReactToMessage(msg.id, emoji)} />
                                </Popover>

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
                        {isAiReplying && (
                            <div className="flex items-end gap-3 animate-in fade-in-50 duration-500 justify-start">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={users.find(u => u.id === 'user2')?.avatar} />
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl relative group bg-card text-card-foreground rounded-bl-none border">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                 <footer className="p-3 border-t bg-card">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" type="button" aria-label="Send a quick message">
                                    <Megaphone className="h-5 w-5 text-accent" />
                                </Button>
                            </PopoverTrigger>
                            <QuickMessagePicker onSelect={handleQuickMessageSelect} />
                        </Popover>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <Button variant="ghost" size="icon" type="button"><Paperclip className="h-5 w-5" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>Attach File</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            autoComplete="off"
                            disabled={isAiReplying}
                        />
                        <Button type="submit" size="icon" disabled={isAiReplying || !message.trim()} aria-label="Send Message">
                            <SendHorizonal className="h-5 w-5" />
                        </Button>
                    </form>
                </footer>
            </TabsContent>

            <TabsContent value="files" className="flex-1 flex flex-col mt-0">
                 <ScrollArea className="flex-1">
                    <div className="p-4 md:p-6 space-y-3">
                       {sampleFiles.map(file => (
                           <Card key={file.name} className="p-3 shadow-sm hover:bg-muted/50 transition-colors">
                               <div className="flex items-center gap-4">
                                   {fileIcons[file.type]}
                                   <div className="flex-1">
                                       <p className="font-semibold">{file.name}</p>
                                       <p className="text-sm text-muted-foreground">{file.size}</p>
                                   </div>
                                   <Button variant="ghost" size="icon">
                                       <Download className="h-5 w-5" />
                                   </Button>
                               </div>
                           </Card>
                       ))}
                    </div>
                 </ScrollArea>
            </TabsContent>
        </Tabs>
    </div>
  );
}
