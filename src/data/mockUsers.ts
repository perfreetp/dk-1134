import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: '张明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    phone: '138****5678',
    creditScore: 720,
    isVerified: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'user-2',
    name: '李娜',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    phone: '139****8765',
    creditScore: 680,
    isVerified: true,
    createdAt: '2024-02-20',
  },
  {
    id: 'user-3',
    name: '王强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    phone: '137****2345',
    creditScore: 750,
    isVerified: true,
    createdAt: '2024-03-10',
  },
  {
    id: 'user-4',
    name: '陈静',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    phone: '136****9876',
    creditScore: 695,
    isVerified: false,
    createdAt: '2024-04-05',
  },
  {
    id: 'user-5',
    name: '刘洋',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    phone: '135****4321',
    creditScore: 710,
    isVerified: true,
    createdAt: '2024-05-12',
  },
];

export const currentUser: User = mockUsers[0];
