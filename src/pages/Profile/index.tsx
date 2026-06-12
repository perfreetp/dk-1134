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
  Plus,
  X,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { Card, CardBody } from '../../components/common/Card';
import { useUserStore } from '../../store/userStore';
import { Location } from '../../types';

interface InvoiceSettings {
  title: string;
  taxNumber: string;
  notes: string;
}

export default function ProfilePage() {
  const { currentUser, locations, addLocation, removeLocation, setDefaultLocation } = useUserStore();
  const [activeSection, setActiveSection] = useState<
    'main' | 'routes' | 'invoice' | 'blacklist'
  >('main');
  const [addRouteModal, setAddRouteModal] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteAddress, setNewRouteAddress] = useState('');
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
    title: '',
    taxNumber: '',
    notes: '',
  });

  const menuItems = [
    { icon: MapPin, label: '常用路线', path: 'routes' as const, badge: locations.length },
    { icon: FileText, label: '发票备注', path: 'invoice' as const },
    { icon: Shield, label: '黑名单管理', path: 'blacklist' as const, badge: 0 },
    { icon: Bell, label: '消息通知' },
    { icon: HelpCircle, label: '帮助与反馈' },
  ];

  const handleAddRoute = () => {
    if (!newRouteName.trim() || !newRouteAddress.trim()) {
      alert('请填写完整的路线信息');
      return;
    }

    const newLocation: Location = {
      id: `loc-${Date.now()}`,
      name: newRouteName.trim(),
      address: newRouteAddress.trim(),
      latitude: 40 + Math.random() * 0.1,
      longitude: 116 + Math.random() * 0.1,
      isDefault: locations.length === 0,
    };

    addLocation(newLocation);
    setNewRouteName('');
    setNewRouteAddress('');
    setAddRouteModal(false);
    alert('路线添加成功！');
  };

  const handleSaveInvoice = () => {
    localStorage.setItem('shunlu_invoice', JSON.stringify(invoiceSettings));
    alert('发票设置已保存！');
  };

  const handleDeleteRoute = (locId: string) => {
    if (window.confirm('确定要删除这个路线吗？')) {
      removeLocation(locId);
    }
  };

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
                  <div className="flex items-center space-x-2">
                    {!location.isDefault && (
                      <button
                        onClick={() => setDefaultLocation(location.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-700"
                      >
                        设为默认
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteRoute(location.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
          <button
            onClick={() => setAddRouteModal(true)}
            className="w-full py-3 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">添加新路线</span>
          </button>
        </div>

        {addRouteModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setAddRouteModal(false)}
            ></div>
            <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">添加新路线</h3>
                <button
                  onClick={() => setAddRouteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    地点名称
                  </label>
                  <input
                    type="text"
                    value={newRouteName}
                    onChange={(e) => setNewRouteName(e.target.value)}
                    placeholder="例如：公司、家、健身房"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细地址
                  </label>
                  <input
                    type="text"
                    value={newRouteAddress}
                    onChange={(e) => setNewRouteAddress(e.target.value)}
                    placeholder="例如：北京市海淀区中关村大街1号"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={handleAddRoute}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  保存路线
                </button>
              </div>
            </div>
          </div>
        )}
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
                value={invoiceSettings.title}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, title: e.target.value })}
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
                value={invoiceSettings.taxNumber}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, taxNumber: e.target.value })}
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
                value={invoiceSettings.notes}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, notes: e.target.value })}
                placeholder="添加常用的行程备注，方便快速填写"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
              />
            </CardBody>
          </Card>
          <button
            onClick={handleSaveInvoice}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
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
