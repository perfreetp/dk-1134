import { create } from 'zustand';
import { Conversation, Message, User } from '../types';
import { mockConversations, mockMessages } from '../data/mockMessages';

interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  selectedConversationId: string | null;
  fetchConversations: () => void;
  sendMessage: (conversationId: string, content: string, senderId: string) => void;
  markAsRead: (conversationId: string) => void;
  getMessages: (conversationId: string) => Message[];
  setSelectedConversation: (conversationId: string | null) => void;
  createConversation: (participants: User[], tripId?: string) => Conversation;
}

export const useMessageStore = create<MessageState>((set, get) => {
  const initialMessages = mockConversations.reduce((acc, conv) => {
    acc[conv.id] = mockMessages.filter((m) => m.conversationId === conv.id);
    return acc;
  }, {} as Record<string, Message[]>);

  return {
    conversations: mockConversations,
    messages: initialMessages,
    selectedConversationId: null,

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

    setSelectedConversation: (conversationId) => {
      set({ selectedConversationId: conversationId });
    },

    createConversation: (participants, tripId) => {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participants: participants.map((p) => p.id),
        participantUsers: participants,
        lastMessage: undefined,
        unreadCount: 0,
        tripId,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        conversations: [newConversation, ...state.conversations],
        messages: {
          ...state.messages,
          [newConversation.id]: [],
        },
      }));

      return newConversation;
    },
  };
});
