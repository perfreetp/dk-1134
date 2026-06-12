import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, CheckCircle, XCircle, MessageCircle, Star } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { mockOrders } from '../../data/mockOrders';
import { Order } from '../../types';
import { formatDate, formatPrice } from '../../utils/format';

export default function OrderPage() {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('all');

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'confirmed') return order.status === 'confirmed';
    return true;
  });

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: { label: '待确认', variant: 'warning' as const, icon: Clock },
      confirmed: { label: '已确认', variant: 'success' as const, icon: CheckCircle },
      inProgress: { label: '进行中', variant: 'info' as const, icon: MapPin },
      completed: { label: '已完成', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: '已取消', variant: 'danger' as const, icon: XCircle },
    };
    return configs[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="我的订单" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {[
            { key: 'all' as const, label: '全部' },
            { key: 'pending' as const, label: '待确认' },
            { key: 'confirmed' as const, label: '已确认' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">订单号: {order.id}</span>
                  </div>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </CardHeader>

                <CardBody className="space-y-4">
                  {order.trip && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {order.trip.origin.name}
                            </div>
                          </div>
                        </div>
                        <div className="border-l-2 border-dashed border-indigo-200 ml-2 h-3"></div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {order.trip.destination.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(order.trip.departureTime)}</span>
                        </div>
                        <div className="text-indigo-600 font-semibold">
                          {formatPrice(order.totalPrice)}
                        </div>
                      </div>

                      {order.trip.driver && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={order.trip.driver.avatar}
                              name={order.trip.driver.name}
                              size="md"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.trip.driver.name}
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                                <span>{order.trip.driver.creditScore}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                              <MessageCircle className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {order.status === 'pending' && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        取消订单
                      </Button>
                      <Button size="sm" className="flex-1">
                        确认支付
                      </Button>
                    </div>
                  )}

                  {order.status === 'confirmed' && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        查看详情
                      </Button>
                      <Button size="sm" className="flex-1">
                        联系司机
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无订单
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              快去首页找顺路的行程吧
            </p>
            <Button onClick={() => navigate('/')}>去首页看看</Button>
          </div>
        )}
      </div>
    </div>
  );
}
