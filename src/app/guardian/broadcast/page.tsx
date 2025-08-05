
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChatView } from '@/components/guardian/chat-view';
import { chats as initialChats, users, currentUser as initialUser } from '@/lib/data';
import type { Chat, Message, User, MessageTag } from '@/lib/data';
import { Header } from '@/components/guardian/header';
import { useAnonymity } from '@/context/anonymity-provider';
import { getAiResponse } from '@/ai/flows/chat-flow';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function BroadcastPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const { isAnonymous } = useAnonymity();
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Find the public chat
  const publicChat = chats.find(c => c.type === 'public');
  const selectedChatId = publicChat?.id;

  useEffect(() => {
    setCurrentUser(prevUser => ({ ...prevUser, anonymous: isAnonymous }));
  }, [isAnonymous]);
  
  if (!publicChat) {
    // This case should not happen in the prototype, but it's good practice.
    // In a real app, you might create a public chat if one doesn't exist.
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center">
         <p>No public broadcast channel found.</p>
         <Link href="/" passHref>
          <Button variant="link">Return to Home</Button>
        </Link>
      </div>
    )
  }


  const handleSendMessage = async (text: string, tag?: MessageTag) => {
    if (!selectedChatId) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' ', ''),
      tag,
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
    
    // AI reply logic - let's not have AI reply in public broadcast to keep it clean
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
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        currentUser={currentUser} 
        onStatusChange={handleStatusChange}
        title="Public Broadcast"
        showBackButton
      />
      <main className="flex-1 flex flex-col">
          <ChatView
            chat={publicChat}
            users={users}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onReactToMessage={handleReactToMessage}
            isAiReplying={isAiReplying}
          />
      </main>
    </div>
  );
}
