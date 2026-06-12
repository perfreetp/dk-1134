import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Clock, Star, MapPin } from 'lucide-react';
import Header from '../../components/layout/Header';
import TripCard from '../../components/TripCard';
import { useTripStore } from '../../store/tripStore';
import { useUserStore } from '../../store/userStore';
import { useOrderStore } from '../../store/orderStore';
import { useMessageStore } from '../../store/messageStore';
import { Trip, SortOption } from '../../types';

export default function HomePage() {
  const navigate = useNavigate();
  const { trips, applyForTrip } = useTripStore();
  const { locations, currentUser } = useUserStore();
  const { createOrder } = useOrderStore();
  const { conversations, createConversation } = useMessageStore();
  const [selectedSort, setSelectedSort] = useState<SortOption>('time');
  const [filterModal, setFilterModal] = useState(false);

  const sortedTrips = [...trips].sort((a, b) => {
    switch (selectedSort) {
      case 'time':
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      case 'detour':
        return a.detourDistance - b.detourDistance;
      case 'credit':
        return (b.driver?.creditScore || 0) - (a.driver?.creditScore || 0);
      default:
        return 0;
    }
  });

  const defaultOrigin = locations.find((l) => l.isDefault) || locations[0];
  const defaultDestination = locations.find((l) => !l.isDefault) || locations[1];

  const handleApply = (trip: Trip) => {
    if (!currentUser) {
      alert('请先登录');
      return;
    }

    if (trip.availableSeats <= 0) {
      alert('该行程已没有空余座位');
      return;
    }

    const seats = 1;
    const order = createOrder(trip, seats, currentUser.id);
    applyForTrip(trip.id, seats);

    if (trip.driver) {
      const existingConversation = conversations.find(
        (conv) =>
          conv.participants.includes(trip.driver.id) &&
          conv.participants.includes(currentUser.id)
      );

      if (!existingConversation) {
        createConversation([currentUser, trip.driver], trip.id);
      }
    }

    const confirmed = window.confirm(
      `拼车申请已提交！\n\n订单信息：\n- 行程：${trip.origin.name} → ${trip.destination.name}\n- 座位数：${seats}座\n- 费用：¥${order.totalPrice}\n\n是否前往订单页查看？`
    );

    if (confirmed) {
      navigate('/order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="顺路拼车" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">快速匹配顺路行程</h2>
            <div className="flex items-center space-x-1 text-indigo-200 text-sm">
              <MapPin className="w-4 h-4" />
              <span>北京</span>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1">
                <div className="text-xs text-indigo-200">出发地</div>
                <div className="text-sm font-medium">{defaultOrigin?.name || '请选择'}</div>
              </div>
            </div>
            <div className="border-l-2 border-dashed border-indigo-300 ml-1.5 h-4"></div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="flex-1">
                <div className="text-xs text-indigo-200">目的地</div>
                <div className="text-sm font-medium">{defaultDestination?.name || '请选择'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索目的地或司机"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setFilterModal(true)}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSort('time')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSort === 'time'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>时间优先</span>
          </button>
          <button
            onClick={() => setSelectedSort('detour')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSort === 'detour'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>绕路少</span>
          </button>
          <button
            onClick={() => setSelectedSort('credit')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSort === 'credit'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>信用高</span>
          </button>
        </div>

        <div className="space-y-3">
          {sortedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onApply={handleApply}
            />
          ))}
        </div>

        {sortedTrips.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无顺路行程
            </h3>
            <p className="text-sm text-gray-500">
              试试调整出发时间或筛选条件
            </p>
          </div>
        )}
      </div>

      {filterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFilterModal(false)}
          ></div>
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md">
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">筛选条件</h3>
                <button
                  onClick={() => setFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  绕路距离
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  defaultValue="3"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>不限</span>
                  <span>≤3公里</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出发时间
                </label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setFilterModal(false)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                应用筛选
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
