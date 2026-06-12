import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';
import { Location } from '../types';
import { useUserStore } from '../store/userStore';
import { Card, CardBody } from './common/Card';

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onSelect: (location: Location) => void;
  label: string;
  excludeLocationId?: string;
}

export default function LocationSelector({
  selectedLocation,
  onSelect,
  label,
  excludeLocationId,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locations } = useUserStore();

  const availableLocations = locations.filter((loc) => loc.id !== excludeLocationId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-xs text-gray-500">{label}</div>
              <div className="text-sm font-medium text-gray-900">
                {selectedLocation?.name || '请选择'}
              </div>
            </div>
          </div>
          {selectedLocation && (
            <div className="text-xs text-gray-500 truncate max-w-[120px]">
              {selectedLocation.address}
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[70vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  选择{label}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto max-h-[50vh]">
              {availableLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => {
                    onSelect(location);
                    setIsOpen(false);
                  }}
                  className="w-full text-left"
                >
                  <Card
                    className={`transition-all ${
                      selectedLocation?.id === location.id
                        ? 'ring-2 ring-indigo-600 bg-indigo-50'
                        : ''
                    }`}
                  >
                    <CardBody className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              location.isDefault
                                ? 'bg-indigo-100 text-indigo-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {location.name}
                              </span>
                              {location.isDefault && (
                                <span className="text-xs text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                                  默认
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {location.address}
                            </div>
                          </div>
                        </div>
                        {selectedLocation?.id === location.id && (
                          <Check className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
