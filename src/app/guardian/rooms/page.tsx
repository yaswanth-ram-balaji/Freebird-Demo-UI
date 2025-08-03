'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/guardian/chat-sidebar';
import { ChatView } from '@/components/guardian/chat-view';
import { chats as initialChats, users, currentUser as initialUser } from '@/lib/data';
import type { Chat, Message, User } from '@/lib/data';
import { MessageSquarePlus, PanelLeft } from 'lucide-react';
import { Header } from '@/components/guardian/header';
import { SOSButton } from '@/components/guardian/sos-button';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hooks/use-mobile';


const NoChatSelected = () => (
  <div className="flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900/50 p-4">
    <MessageSquarePlus className="w-20 h-20 text-muted-foreground mb-4" />
    <h2 className="text-2xl font-bold">No Chat Selected</h2>
    <p className="text-muted-foreground">Select a chat from the sidebar to start messaging.</p>
  </div>
);

export default function RoomsPage() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    if (!isMobile) {
        // Set a default chat on desktop
        setSelectedChatId('chat1');
    }
  }, [isMobile]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    if(isMobile) {
        setIsSidebarOpen(false); // Close sidebar on selection in mobile
    }
  };

  const handleSendMessage = (text: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', ''),
    };

    setChats(prevChats =>
      prevChats.map(chat => {
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
    );
  };
  
  const handleStatusChange = (status: User['status']) => {
    setCurrentUser(prevUser => ({...prevUser, status}));
    // Here you would also update the user's status on the backend
  }
  
  const handleToggleAnonymous = () => {
    setCurrentUser(prevUser => ({...prevUser, anonymous: !prevUser.anonymous}));
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const isDark = !prev;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return isDark;
    });
  };

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const sidebarContent = (
    <ChatSidebar
      chats={chats}
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
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onStatusChange={handleStatusChange}
        onToggleAnonymous={handleToggleAnonymous}
      />
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
             <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-16 left-2 z-10">
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
            />
          ) : (
            <NoChatSelected />
          )}
        </main>
      </div>
      <SOSButton />
    </div>
  );
}