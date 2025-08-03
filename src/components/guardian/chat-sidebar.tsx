'use client';

import type { Chat, User } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Users, MessageSquare, User as UserIcon } from 'lucide-react';
import * as React from 'react';

type ChatSidebarProps = {
  chats: Chat[];
  users: User[];
  currentUser: User;
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
};

export function ChatSidebar({
  chats,
  users,
  currentUser,
  selectedChatId,
  onSelectChat,
}: ChatSidebarProps) {
  const getChatDetails = (chat: Chat) => {
    if (chat.type === 'private') {
      const otherUserId = chat.participants.find(p => p !== currentUser.id);
      const otherUser = users.find(u => u.id === otherUserId);
      return {
        name: otherUser?.name || 'Unknown User',
        avatar: otherUser?.avatar || '',
        fallback: otherUser?.name?.charAt(0) || 'U',
      };
    }
    return {
      name: chat.name || 'Group Chat',
      avatar: '',
      fallback: chat.name?.charAt(0) || 'G',
    };
  };

  const statusColors: Record<User['status'], string> = {
    safe: 'bg-green-500',
    help: 'bg-yellow-500',
    danger: 'bg-red-500',
    online: 'bg-gray-400',
  };

  const getUserStatus = (chat: Chat): User['status'] | null => {
    if (chat.type === 'private') {
        const otherUserId = chat.participants.find(p => p !== currentUser.id);
        const otherUser = users.find(u => u.id === otherUserId);
        return otherUser?.status || null;
    }
    return null;
  }

  return (
    <aside className="w-80 border-r flex flex-col bg-card">
      <div className="p-4 space-y-4 border-b">
        <h2 className="text-2xl font-bold">Chats</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-10" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.map(chat => {
            const details = getChatDetails(chat);
            const userStatus = getUserStatus(chat);

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  'w-full text-left p-3 flex items-center gap-3 rounded-lg transition-colors',
                  selectedChatId === chat.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={details.avatar} alt={details.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                        {chat.type === 'public' && <MessageSquare size={20} />}
                        {chat.type === 'group' && <Users size={20} />}
                        {chat.type === 'private' && details.fallback}
                    </AvatarFallback>
                  </Avatar>
                  {userStatus && <span className={cn('absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-card', statusColors[userStatus])} />}
                </div>

                <div className="flex-1 truncate">
                  <p className="font-semibold">{details.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>

                <div className="flex flex-col items-end text-xs text-muted-foreground gap-1">
                  <span>{chat.lastMessageTime}</span>
                  {chat.unreadCount && chat.unreadCount > 0 ? (
                    <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground">
                      {chat.unreadCount}
                    </Badge>
                  ) : <div className="h-5 w-5"/>}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
