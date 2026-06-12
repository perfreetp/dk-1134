import { Conversation, Message } from '../types';
import { mockUsers } from './mockUsers';

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: '您好，我已经出发了，大概10分钟后到达您的小区',
    type: 'text',
    createdAt: '2026-06-12 08:20:00',
    isRead: false,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: '好的，我已经在楼下等了',
    type: 'text',
    createdAt: '2026-06-12 08:22:00',
    isRead: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-2'],
    participantUsers: [mockUsers[0], mockUsers[1]],
    lastMessage: mockMessages[0],
    unreadCount: 1,
    tripId: 'trip-1',
    createdAt: '2026-06-12 08:00:00',
  },
];
