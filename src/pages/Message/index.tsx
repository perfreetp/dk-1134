import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Bell } from 'lucide-react';
import Header from '../../components/layout/Header';
import Avatar from '../../components/common/Avatar';
import { useMessageStore } from '../../store/messageStore';
import { useUserStore } from '../../store/userStore';
import { Conversation, Message } from '../../types';
import { getRelativeTime } from '../../utils/format';

export default function MessagePage() {
  const navigate = useNavigate();
  const { conversations, messages, sendMessage, markAsRead, getMessages } = useMessageStore();
  const { currentUser } = useUserStore();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedConversation) {
      const msgs = getMessages(selectedConversation.id);
      setChatMessages(msgs);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, messages, getMessages, markAsRead]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation || !currentUser) return;

    sendMessage(selectedConversation.id, messageInput.trim(), currentUser.id);
    setChatMessages(getMessages(selectedConversation.id));
    setMessageInput('');
  };

  if (selectedConversation) {
    const otherUser = selectedConversation.participantUsers?.find(
      (u) => u.id !== currentUser?.id
    );

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col h-screen">
        <Header
          title={otherUser?.name || '聊天'}
          showBack
          rightAction={
            <div className="flex items-center space-x-2">
              <Avatar src={otherUser?.avatar} name={otherUser?.name || ''} size="sm" />
            </div>
          }
        />

        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 pb-20"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          {chatMessages.map((message) => {
            const isMe = message.senderId === currentUser?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] ${
                    isMe ? 'order-2' : 'order-1'
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div
                    className={`text-xs text-gray-400 mt-1 ${
                      isMe ? 'text-right' : 'text-left'
                    }`}
                  >
                    {getRelativeTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-md mx-auto flex items-center space-x-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入消息..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="消息" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-6 h-6" />
            <span className="text-lg font-semibold">出发提醒</span>
          </div>
          <p className="text-sm text-amber-100">
            明早8:30出发，记得提前到达上车点
          </p>
        </div>

        <div className="space-y-2">
          {conversations.map((conversation) => {
            const otherUser = conversation.participantUsers?.find(
              (u) => u.id !== currentUser?.id
            );
            const hasUnread = conversation.unreadCount > 0;

            return (
              <button
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  markAsRead(conversation.id);
                }}
                className="w-full text-left"
              >
                <div className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="relative">
                    <Avatar
                      src={otherUser?.avatar}
                      name={otherUser?.name || ''}
                      size="lg"
                    />
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {otherUser?.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {conversation.lastMessage &&
                          getRelativeTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate mt-1 ${
                        hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {conversation.lastMessage?.content}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无消息
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              去首页找顺路的行程，发起拼车后就可以聊天了
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              去首页看看
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
