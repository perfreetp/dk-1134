import { Home, PlusCircle, List, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/publish', icon: PlusCircle, label: '发布' },
    { path: '/order', icon: List, label: '订单' },
    { path: '/message', icon: MessageCircle, label: '消息' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 pb-6">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[48px] transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
