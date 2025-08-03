'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/guardian/header';
import { ChatSidebar } from '@/components/guardian/chat-sidebar';
import { ChatView } from '@/components/guardian/chat-view';
import { SOSButton } from '@/components/guardian/sos-button';
import { MapView } from '@/components/guardian/map-view';
import type { Chat, User, Message } from '@/lib/data';
import { chats as initialChats, users as initialUsers, currentUser as initialCurrentUser } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Map } from 'lucide-react';

export default function GuardianLinkPage() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChats[0].id);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);
  
  const handleSendMessage = (text: string) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
  };

  const handleStatusChange = (status: 'safe' | 'help' | 'danger') => {
    setCurrentUser(prevUser => ({ ...prevUser, status }));
  };

  const toggleAnonymous = () => {
    setCurrentUser(prevUser => ({ ...prevUser, anonymous: !prevUser.anonymous }));
  };
  
  const selectedChat = chats.find(c => c.id === selectedChatId) ?? null;

  return (
    <div className={cn('flex flex-col h-screen bg-background text-foreground transition-colors duration-300')}>
      <Header
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onStatusChange={handleStatusChange}
        onToggleAnonymous={toggleAnonymous}
      />
      <div className="flex flex-1 overflow-hidden border-t">
        <ChatSidebar
          chats={chats}
          users={initialUsers}
          currentUser={currentUser}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
        <main className="flex-1 flex flex-col bg-slate-50 dark:bg-gray-900/50">
           <Tabs defaultValue="chat" className="flex flex-col flex-1">
            <div className="p-4 border-b bg-card">
              <TabsList>
                <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4"/>Chat</TabsTrigger>
                <TabsTrigger value="map"><Map className="mr-2 h-4 w-4"/>Map View</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
               {selectedChat ? (
                <ChatView
                  chat={selectedChat}
                  users={initialUsers}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>Select a chat to start messaging</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="map" className="flex-1 overflow-auto m-0">
              <MapView />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <SOSButton />
    </div>
  );
}
