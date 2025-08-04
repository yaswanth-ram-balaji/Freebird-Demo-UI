
'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatSidebar } from '@/components/guardian/chat-sidebar';
import { ChatView } from '@/components/guardian/chat-view';
import { chats as initialChats, users, currentUser as initialUser } from '@/lib/data';
import type { Chat, Message, User } from '@/lib/data';
import { MessageSquarePlus, PanelLeft, Loader } from 'lucide-react';
import { Header } from '@/components/guardian/header';
import { SOSButton } from '@/components/guardian/sos-button';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnonymity } from '@/context/anonymity-provider';
import { getAiResponse } from '@/ai/flows/chat-flow';

const NoChatSelected = () => (
  <div className="flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900/50 p-4">
    <MessageSquarePlus className="w-20 h-20 text-muted-foreground mb-4" />
    <h2 className="text-2xl font-bold">No Chat Selected</h2>
    <p className="text-muted-foreground">Select a chat from the sidebar to start messaging.</p>
  </div>
);

function RoomsPageContent() {
  const searchParams = useSearchParams();
  const requestedChatId = searchParams.get('chatId');

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAnonymous } = useAnonymity();
  const [isAiReplying, setIsAiReplying] = useState(false);
  
  const activeChats = chats.filter(c => c.type !== 'public' && c.participants.includes(currentUser.id));
  
  useEffect(() => {
    if (requestedChatId) {
      setSelectedChatId(requestedChatId);
    }
  }, [requestedChatId]);

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
    if (currentChat && currentChat.type !== 'public') {
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
  
  const selectedChat = chats.find(c => c.id === selectedChatId);

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
          {selectedChat ? (
            <ChatView
              chat={selectedChat}
              users={users}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onReactToMessage={handleReactToMessage}
              isAiReplying={isAiReplying}
            />
          ) : (
             isMobile ? null : <NoChatSelected />
          )}
        </main>
      </div>
      <SOSButton />
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

export default function RoomsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RoomsPageContent />
    </Suspense>
  )
}
