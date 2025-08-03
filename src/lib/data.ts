
export type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'safe' | 'help' | 'danger' | 'online';
  anonymous: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  reactions?: { [emoji: string]: number };
};

export type Chat = {
  id: string;
  type: 'public' | 'private' | 'group';
  name?: string;
  participants: string[];
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
};

export const currentUser: User = {
  id: 'user1',
  name: 'You',
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
  { id: 'user6', name: 'Campus Security', avatar: 'https://i.pravatar.cc/150?u=security', status: 'online', anonymous: false },
  { id: 'user7', name: 'Ben', avatar: 'https://i.pravatar.cc/150?u=user7', status: 'safe', anonymous: false },
  { id: 'user8', name: 'Chloe', avatar: 'https://i.pravatar.cc/150?u=user8', status: 'safe', anonymous: false },
  { id: 'user9', name: 'David', avatar: 'https://i.pravatar.cc/150?u=user9', status: 'online', anonymous: false },
];

export const chats: Chat[] = [
  {
    id: 'chat1',
    type: 'public',
    name: 'Public Broadcast',
    participants: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9'],
    messages: [
      { id: 'm1-1', senderId: 'user6', text: '[ADMIN] This is a public announcement: The north gate will be closed for maintenance at 5 PM.', timestamp: '10:30 AM' },
      { id: 'm1-2', senderId: 'user2', text: 'Thanks for the heads up!', timestamp: '10:31 AM' },
      { id: 'm1-3', senderId: 'user4', text: 'Does anyone have a spare charger?', timestamp: '11:15 AM' },
      { id: 'm1-4', senderId: 'user7', text: 'I have one! I am near the library.', timestamp: '11:17 AM' },
      { id: 'm1-5', senderId: 'user8', text: 'Be careful everyone, I saw a suspicious person near the west entrance.', timestamp: '11:20 AM' },
      { id: 'm1-6', senderId: 'user6', text: '[ADMIN] We have dispatched a security officer to the west entrance. Please report any suspicious activity.', timestamp: '11:22 AM' },

    ],
    lastMessage: 'Security dispatched to west entrance.',
    lastMessageTime: '11:22 AM',
    unreadCount: 4,
  },
  {
    id: 'chat2',
    type: 'group',
    name: 'Study Group',
    participants: ['user1', 'user3', 'user4'],
    messages: [
      { id: 'm2-1', senderId: 'user3', text: 'Hey everyone, are we still meeting at the library?', timestamp: 'Yesterday' },
      { id: 'm2-2', senderId: 'user1', text: 'Yes, I\'ll be there around 2 PM.', timestamp: 'Yesterday' },
    ],
    lastMessage: 'Yes, I\'ll be there around 2 PM.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: 'chat3',
    type: 'private',
    participants: ['user1', 'user2'],
    messages: [
      { id: 'm3-1', senderId: 'user2', text: 'Hi! Can you send me the notes from today\'s class?', timestamp: '1:20 PM' },
    ],
    lastMessage: 'Hi! Can you send me the notes from today\'s class?',
    lastMessageTime: '1:20 PM',
    unreadCount: 3,
  },
  {
    id: 'chat4',
    type: 'private',
    participants: ['user1', 'user5'],
    messages: [
      { id: 'm4-1', senderId: 'user5', text: 'Are you okay? I saw your status.', timestamp: '9:05 AM' },
      { id: 'm4-2', senderId: 'user1', text: 'Not really, something feels off.', timestamp: '9:06 AM' },
      { id: 'm4-3', senderId: 'user5', text: 'Help me!', timestamp: '9:07 AM' },
    ],
    lastMessage: 'Help me!',
    lastMessageTime: '9:07 AM',
    unreadCount: 1,
  },
];
