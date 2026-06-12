import { Card, CardBody } from './common/Card';
import Avatar from './common/Avatar';
import Badge from './common/Badge';
import Button from './common/Button';
import { Trip } from '../types';
import { formatDate, formatDistance, formatPrice } from '../utils/format';
import { MapPin, Clock, Star, Users } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onApply?: (trip: Trip) => void;
  onClick?: (trip: Trip) => void;
}

export default function TripCard({ trip, onApply, onClick }: TripCardProps) {
  const isRecurring = trip.isRecurring;

  return (
    <Card
      hoverable
      onClick={() => onClick?.(trip)}
      className="mb-3 overflow-hidden"
    >
      <CardBody className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar
              src={trip.driver?.avatar}
              name={trip.driver?.name || '司机'}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 truncate">
                  {trip.driver?.name}
                </h3>
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">
                    {trip.driver?.creditScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {trip.driver?.isVerified && (
                  <Badge variant="info" size="sm">
                    已认证
                  </Badge>
                )}
                {isRecurring && (
                  <Badge variant="success" size="sm">
                    周期行程
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 truncate">
                {trip.origin.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {trip.origin.address}
              </div>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-indigo-200 ml-2 h-4"></div>

          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 truncate">
                {trip.destination.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {trip.destination.address}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatDate(trip.departureTime)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>剩{trip.availableSeats}座</span>
            </div>
          </div>
          <div className="text-indigo-600 font-semibold">
            {formatPrice(trip.pricePerSeat)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            绕路 <span className="text-indigo-600 font-medium">{formatDistance(trip.detourDistance)}</span>
          </div>
          {onApply && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onApply(trip);
              }}
              disabled={trip.availableSeats === 0}
            >
              申请拼车
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
