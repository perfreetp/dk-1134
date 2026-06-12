import { useState } from 'react';
import {
  Settings,
  MapPin,
  FileText,
  Shield,
  Star,
  ChevronRight,
  LogOut,
  Bell,
  HelpCircle,
  Award,
  TrendingUp,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { Card, CardBody } from '../../components/common/Card';
import { useUserStore } from '../../store/userStore';

export default function ProfilePage() {
  const { currentUser, locations } = useUserStore();
  const [activeSection, setActiveSection] = useState<
    'main' | 'routes' | 'invoice' | 'blacklist'
  >('main');

  const menuItems: Array<{
    icon: typeof MapPin;
    label: string;
    path?: 'routes' | 'invoice' | 'blacklist';
    badge?: number;
  }> = [
    { icon: MapPin, label: '常用路线', path: 'routes', badge: locations.length },
    { icon: FileText, label: '发票备注', path: 'invoice' },
    { icon: Shield, label: '黑名单管理', path: 'blacklist', badge: 0 },
    { icon: Bell, label: '消息通知' },
    { icon: HelpCircle, label: '帮助与反馈' },
  ];

  if (activeSection === 'routes') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="常用路线" showBack />
        <div className="max-w-md mx-auto px-4 py-4 space-y-3">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{location.name}</span>
                        {location.isDefault && (
                          <Badge variant="info" size="sm">
                            默认
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{location.address}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
            + 添加新路线
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === 'invoice') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="发票备注" showBack />
        <div className="max-w-md mx-auto px-4 py-4 space-y-4">
          <Card>
            <CardBody>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发票抬头
              </label>
              <input
                type="text"
                placeholder="请输入发票抬头"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                税号
              </label>
              <input
                type="text"
                placeholder="请输入税号（可选）"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                常用备注模板
              </label>
              <textarea
                placeholder="添加常用的行程备注，方便快速填写"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
              />
            </CardBody>
          </Card>
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            保存设置
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === 'blacklist') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="黑名单管理" showBack />
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无黑名单用户
            </h3>
            <p className="text-sm text-gray-500">
              被拉入黑名单的用户将无法与您拼车
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="我的" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <Card className="overflow-hidden">
          <CardBody className="p-5">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar
                src={currentUser?.avatar}
                name={currentUser?.name || '用户'}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentUser?.name}
                  </h2>
                  {currentUser?.isVerified && (
                    <Badge variant="info" size="sm">
                      已认证
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {currentUser?.phone}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-amber-500 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-lg font-semibold">
                    {currentUser?.creditScore}
                  </span>
                </div>
                <p className="text-xs text-gray-500">信用评分</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-indigo-600 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-lg font-semibold">12</span>
                </div>
                <p className="text-xs text-gray-500">拼车次数</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-lg font-semibold">¥360</span>
                </div>
                <p className="text-xs text-gray-500">节省金额</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === menuItems.length - 1;
              return (
                <button
                  key={item.label}
                  onClick={() => item.path && setActiveSection(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors ${
                    !isLast ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge !== undefined && (
                      <Badge variant="default" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-0">
            <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">退出登录</span>
              </div>
            </button>
          </CardBody>
        </Card>

        <div className="text-center text-xs text-gray-400 pt-4">
          <p>顺路拼车 v1.0.0</p>
          <p className="mt-1">让出行更简单</p>
        </div>
      </div>
    </div>
  );
}
