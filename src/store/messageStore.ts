import { create } from 'zustand';
import { Conversation, Message } from '../types';
import { mockConversations, mockMessages } from '../data/mockMessages';

interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  fetchConversations: () => void;
  sendMessage: (conversationId: string, content: string, senderId: string) => void;
  markAsRead: (conversationId: string) => void;
  getMessages: (conversationId: string) => Message[];
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: {},

  fetchConversations: () =>
    set({
      conversations: mockConversations,
      messages: mockConversations.reduce((acc, conv) => {
        acc[conv.id] = mockMessages.filter((m) => m.conversationId === conv.id);
        return acc;
      }, {} as Record<string, Message[]>),
    }),

  sendMessage: (conversationId, content, senderId) =>
    set((state) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId,
        content,
        type: 'text',
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      const conversationMessages = state.messages[conversationId] || [];
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, lastMessage: newMessage } : conv
      );

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...conversationMessages, newMessage],
        },
        conversations: updatedConversations,
      };
    }),

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((msg) => ({
          ...msg,
          isRead: true,
        })),
      },
    })),

  getMessages: (conversationId) => {
    return get().messages[conversationId] || [];
  },
}));
