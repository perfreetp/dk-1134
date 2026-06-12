import { useState } from 'react';
import { Calendar, Clock, Users, DollarSign, Repeat, AlertCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import LocationSelector from '../../components/LocationSelector';
import Button from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { useTripStore } from '../../store/tripStore';
import { useUserStore } from '../../store/userStore';
import { Location } from '../../types';

export default function PublishPage() {
  const { publishTrip } = useTripStore();
  const { currentUser, locations } = useUserStore();

  const [origin, setOrigin] = useState<Location | null>(locations[0]);
  const [destination, setDestination] = useState<Location | null>(locations[1]);
  const [departureDate, setDepartureDate] = useState('2026-06-13');
  const [departureTime, setDepartureTime] = useState('08:30');
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState(15);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState('工作日');
  const [notes, setNotes] = useState('');

  const handlePublish = () => {
    if (!origin || !destination || !currentUser) {
      alert('请完善行程信息');
      return;
    }

    const departureDateTime = `${departureDate} ${departureTime}:00`;

    publishTrip({
      driverId: currentUser.id,
      driver: currentUser,
      origin,
      destination,
      departureTime: departureDateTime,
      availableSeats: seats,
      totalSeats: 4,
      pricePerSeat: price,
      detourDistance: 0,
      status: 'active',
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      notes: notes || undefined,
    });

    alert('行程发布成功！');
    setOrigin(locations[0]);
    setDestination(locations[1]);
    setSeats(3);
    setPrice(15);
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="发布行程" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-6 h-6" />
            <span className="text-lg font-semibold">顺路赚油费</span>
          </div>
          <p className="text-sm text-green-100">
            发布行程，让同路的乘客分摊你的油费
          </p>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出发地
              </label>
              <LocationSelector
                selectedLocation={origin}
                onSelect={setOrigin}
                label="出发地"
                excludeLocationId={destination?.id}
              />
            </div>

            <div className="border-l-2 border-dashed border-indigo-200 ml-2 h-6"></div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目的地
              </label>
              <LocationSelector
                selectedLocation={destination}
                onSelect={setDestination}
                label="目的地"
                excludeLocationId={origin?.id}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">出发日期</span>
              </div>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">出发时间</span>
              </div>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">空余座位</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSeats(num)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      seats === num
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num}座
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">每座价格</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="flex-1"
                />
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold min-w-[80px] text-center">
                  ¥{price}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Repeat className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">周期行程</span>
              </div>
              <button
                onClick={() => setIsRecurring(!isRecurring)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isRecurring ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isRecurring ? 'translate-x-7' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-gray-500">
                    周期行程将自动复制到选定日期
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['工作日', '周一三五', '周二四六', '周末'].map((pattern) => (
                    <button
                      key={pattern}
                      onClick={() => setRecurringPattern(pattern)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        recurringPattern === pattern
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              行程备注（可选）
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：迟到不等、请系好安全带、可携带小件行李"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
            />
          </CardBody>
        </Card>

        <Button
          onClick={handlePublish}
          className="w-full py-4 text-base"
          size="lg"
        >
          发布行程
        </Button>
      </div>
    </div>
  );
}
