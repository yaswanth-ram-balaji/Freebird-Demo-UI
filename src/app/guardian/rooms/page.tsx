
'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ChatSidebar } from '@/components/guardian/chat-sidebar';
import { ChatView } from '@/components/guardian/chat-view';
import { chats as initialChats, users, currentUser as initialUser } from '@/lib/data';
import type { Chat, Message, User } from '@/lib/data';
import { MessageSquarePlus, PanelLeft, Loader } from 'lucide-react';
import { Header } from '@/components/guardian/header';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnonymity } from '@/context/anonymity-provider';
import { getAiResponse } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'guardianlink-group-chats';
const ALL_CHATS_STORAGE_KEY = 'guardianlink-all-chats';


const NoChatSelected = () => (
  <div className="flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900/50 p-4">
    <MessageSquarePlus className="w-20 h-20 text-muted-foreground mb-4" />
    <h2 className="text-2xl font-bold">No Chat Selected</h2>
    <p className="text-muted-foreground">Select a chat from the sidebar to start messaging.</p>
  </div>
);

function RoomsPageContent({ requestedChatId }: { requestedChatId: string | null }) {
  const router = useRouter();
  const { toast } = useToast();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAnonymous } = useAnonymity();
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    try {
        // Load both private/public chats and group chats
        const storedAllChats = localStorage.getItem(ALL_CHATS_STORAGE_KEY);
        const allChats = storedAllChats ? JSON.parse(storedAllChats) : initialChats.filter(c => c.type !== 'group');

        const storedGroupChats = localStorage.getItem(STORAGE_KEY);
        const groupChats = storedGroupChats ? JSON.parse(storedGroupChats) : [];

        // Combine them, ensuring no duplicate groups if they were in initialChats
        const combinedChats = [...allChats.filter((c: Chat) => c.type !== 'group'), ...groupChats];
        
        setChats(combinedChats);

        // If coming from group rooms, a chatId might be present
        if (requestedChatId) {
          setSelectedChatId(requestedChatId);
        }

    } catch (error) {
        console.error("Failed to load chats from localStorage", error);
        setChats(initialChats);
    }
  }, [requestedChatId]);

  useEffect(() => {
    if (isMounted) {
        try {
            // Save all chats back to a single key to persist messages etc.
            // We separate group chats for the group list page, but here we need the whole state.
            const groupChats = chats.filter(c => c.type === 'group');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(groupChats));
            localStorage.setItem(ALL_CHATS_STORAGE_KEY, JSON.stringify(chats));

        } catch (error) {
            console.error("Failed to save chats to localStorage", error);
        }
    }
  }, [chats, isMounted]);

  const activeChats = chats.filter(c => c.type !== 'public' && c.participants.includes(currentUser.id));

  useEffect(() => {
    setCurrentUser(prevUser => ({ ...prevUser, anonymous: isAnonymous }));
  }, [isAnonymous]);

  useEffect(() => {
    if (!isMobile) {
      if (!selectedChatId && activeChats.length > 0 && !requestedChatId) {
        setSelectedChatId(activeChats[0].id);
      }
    }
  }, [isMobile, selectedChatId, activeChats, requestedChatId]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    if(isMobile) {
        setIsSidebarOpen(false); // Close sidebar on selection in mobile
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', ''),
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: text,
          lastMessageTime: newMessage.timestamp,
        };
      }
      return chat;
    })
    setChats(updatedChats);
    
    // AI reply logic
    const currentChat = updatedChats.find(c => c.id === selectedChatId);
    if (currentChat && currentChat.participants.includes('user2') && currentChat.type !== 'public') {
      setIsAiReplying(true);
      try {
        const aiResponse = await getAiResponse(currentChat.messages);
        
        const aiMessage: Message = {
            id: `m-${Date.now() + 1}`,
            senderId: 'user2', // Simulate reply from Alex
            text: aiResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', ''),
        };
        
         setChats(prevChats =>
          prevChats.map(chat => {
            if (chat.id === selectedChatId) {
              return {
                ...chat,
                messages: [...chat.messages, aiMessage],
                lastMessage: aiResponse,
                lastMessageTime: aiMessage.timestamp,
              };
            }
            return chat;
          })
        );
      } catch (error) {
        console.error("Failed to get AI response:", error);
      } finally {
        setIsAiReplying(false);
      }
    }
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (!selectedChatId) return;

    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: chat.messages.map(message => {
              if (message.id === messageId) {
                const newReactions = { ...(message.reactions || {}) };
                newReactions[emoji] = (newReactions[emoji] || 0) + 1;
                return { ...message, reactions: newReactions };
              }
              return message;
            }),
          };
        }
        return chat;
      })
    );
  };
  
  const handleStatusChange = (status: User['status']) => {
    setCurrentUser(prevUser => ({...prevUser, status}));
    // Here you would also update the user's status on the backend
  }

  const handleLeaveRoom = (chatId: string, chatName?: string) => {
    toast({
        title: 'Left Room',
        description: `You have left "${chatName}".`,
    });
    router.push('/guardian/group-rooms');
  }
  
  const selectedChat = chats.find(c => c.id === selectedChatId);

  // If a chat is selected, show only the chat view (focused mode)
  if (selectedChat) {
    return (
       <div className="flex flex-col h-screen bg-background">
          <main className="flex-1 flex flex-col">
              <ChatView
                chat={selectedChat}
                users={users}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onReactToMessage={handleReactToMessage}
                isAiReplying={isAiReplying}
                onLeaveRoom={handleLeaveRoom}
              />
          </main>
       </div>
    );
  }

  // If no chat is selected, show the sidebar and the main content area
  const sidebarContent = (
    <ChatSidebar
      chats={activeChats}
      users={users}
      currentUser={currentUser}
      selectedChatId={selectedChatId}
      onSelectChat={handleSelectChat}
    />
  )

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        currentUser={currentUser} 
        onStatusChange={handleStatusChange}
        showBackButton
        title="My Chats"
      />
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
             <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-16 left-2 z-10 md:hidden">
                        <PanelLeft />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                    {sidebarContent}
                </SheetContent>
            </Sheet>
        ) : (
          sidebarContent
        )}

        <main className="flex-1 flex flex-col">
          { isMounted && (isMobile ? null : <NoChatSelected />) }
        </main>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-background">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function RoomsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
<<<<<<< HEAD
  const params = React.use(searchParams);
  const chatId = typeof params.chatId === 'string' ? params.chatId : null;
=======
  const unwrappedSearchParams = React.use(searchParams);
  const chatId = typeof unwrappedSearchParams.chatId === 'string' ? unwrappedSearchParams.chatId : null;
>>>>>>> 6b1483b (I see this error with the app, reported by NextJS, please fix it. The er)

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RoomsPageContent requestedChatId={chatId} />
    </Suspense>
  )
}
