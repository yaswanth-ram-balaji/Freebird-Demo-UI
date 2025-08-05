
import { z } from 'zod';

export type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'safe' | 'help' | 'danger' | 'online';
  anonymous: boolean;
};

export type MessageTag = 'ALERT' | 'INFO';

export const MessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timestamp: z.string(),
  reactions: z.optional(z.record(z.string(), z.number())),
  tag: z.optional(z.enum(['ALERT', 'INFO'])),
});
export type Message = z.infer<typeof MessageSchema>;


export type Chat = {
  id: string;
  type: 'public' | 'private' | 'group';
  name?: string;
  participants: string[];
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  code?: string;
  createdAt?: Date;
};

export const currentUser: User = {
  id: 'user1',
  name: 'Demo User',
  avatar: 'https://i.pravatar.cc/150?u=user1',
  status: 'safe',
  anonymous: false,
};

export const users: User[] = [
  currentUser,
  { id: 'user2', name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=user2', status: 'safe', anonymous: false },
  { id: 'user3', name: 'Maria', avatar: 'https://i.pravatar.cc/150?u=user3', status: 'help', anonymous: false },
  { id: 'user4', name: 'John', avatar: 'https://i.pravatar.cc/150?u=user4', status: 'online', anonymous: false },
  { id: 'user5', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=user5', status: 'danger', anonymous: false },
  { id: 'user6', name: 'Admin', avatar: 'https://i.pravatar.cc/150?u=security', status: 'online', anonymous: false },
  { id: 'user7', name: 'Ben', avatar: 'https://i.pravatar.cc/150?u=user7', status: 'safe', anonymous: false },
  { id: 'user8', name: 'Chloe', avatar: 'https://i.pravatar.cc/150?u=user8', status: 'safe', anonymous: false },
  { id: 'user9', name: 'David', avatar: 'https://i.pravatar.cc/150?u=user9', status: 'online', anonymous: false },
  { id: 'user10', name: 'Emily', avatar: 'https://i.pravatar.cc/150?u=user10', status: 'online', anonymous: false },
  { id: 'user11', name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=user11', status: 'safe', anonymous: false },
  { id: 'user12', name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=user12', status: 'help', anonymous: false },
];

export const chats: Chat[] = [
  {
    id: 'chat1',
    type: 'public',
    name: 'Public Broadcast',
    participants: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12'],
    messages: [
      { id: 'm1-1', senderId: 'user6', text: '[ADMIN] Welcome to the FreeBird demo! This is a public channel for all users.', timestamp: '10:30 AM', reactions: { '👍': 5 }, tag: 'INFO' },
      { id: 'm1-2', senderId: 'user2', text: 'Hey everyone! Hope you are having a great day.', timestamp: '10:31 AM', reactions: { '❤️': 2 }, tag: 'INFO' },
      { id: 'm1-5', senderId: 'user5', text: 'Suspicious individual spotted near the library. Please be careful.', timestamp: '11:18 AM', tag: 'ALERT' },
      { id: 'm1-3', senderId: 'user4', text: 'This app looks promising! Great for staying connected.', timestamp: '11:15 AM', tag: 'INFO' },
      { id: 'm1-4', senderId: 'user7', text: 'Agreed. The safety features are a huge plus.', timestamp: '11:17 AM', reactions: { '👍': 1 }, tag: 'INFO' },
      { id: 'm1-6', senderId: 'user6', text: '[ADMIN] Reminder: The "Emergency" button is for demo purposes. In a real scenario, it would contact authorities.', timestamp: '11:22 AM', tag: 'INFO' },
    ],
    lastMessage: 'Check out the new features!',
    lastMessageTime: '11:22 AM',
    unreadCount: 4,
  },
  {
    id: 'chat2',
    type: 'group',
    name: 'Hackathon Team',
    participants: ['user1', 'user3', 'user4'],
    messages: [
      { id: 'm2-1', senderId: 'user3', text: 'Alright team, let\'s get this demo ready!', timestamp: 'Yesterday' },
      { id: 'm2-2', senderId: 'user1', text: 'I\'ve updated the UI components. Let me know what you think.', timestamp: 'Yesterday', reactions: { '👍': 1, '🚀': 1 } },
      { id: 'm2-3', senderId: 'user4', text: 'Looks great! Let\'s test the SOS flow.', timestamp: '9:00 AM' },
    ],
    lastMessage: 'Looks great! Let\'s test the SOS flow.',
    lastMessageTime: '9:00 AM',
    unreadCount: 1,
    code: 'HACK24',
    createdAt: new Date('2025-08-01'),
  },
  {
    id: 'chat3',
    type: 'private',
    participants: ['user1', 'user2'],
    messages: [
      { id: 'm3-1', senderId: 'user2', text: 'Hey, can you double-check the presentation slides?', timestamp: '1:20 PM' },
       { id: 'm3-2', senderId: 'user1', text: 'Sure, I\'ll take a look now.', timestamp: '1:21 PM', reactions: { '👍': 1 } },
    ],
    lastMessage: 'Sure, I\'ll take a look now.',
    lastMessageTime: '1:21 PM',
    unreadCount: 0,
  },
  {
    id: 'chat4',
    type: 'private',
    participants: ['user1', 'user5'],
    messages: [
      { id: 'm4-1', senderId: 'user5', text: 'I think I\'m lost, can you see my location on the map?', timestamp: '9:05 AM' },
      { id: 'm4-2', senderId: 'user1', text: 'Checking now... looks like you\'re near the main auditorium.', timestamp: '9:06 AM' },
      { id: 'm4-3', senderId: 'user5', text: 'Help me!', timestamp: '9:07 AM', reactions: { '😢': 1 } },
    ],
    lastMessage: 'Help me!',
    lastMessageTime: '9:07 AM',
    unreadCount: 1,
  },
  {
    id: 'chat5',
    type: 'group',
    name: 'Maths Study Group',
    participants: ['user1', 'user7', 'user9'],
    messages: [],
    lastMessage: 'Room created',
    lastMessageTime: '10:00 AM',
    unreadCount: 0,
    code: 'NPHL5U',
    createdAt: new Date('2025-08-03'),
  },
];
