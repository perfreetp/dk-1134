import { Order } from '../types';
import { mockTrips } from './mockTrips';
import { mockUsers } from './mockUsers';

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    tripId: 'trip-1',
    trip: mockTrips[0],
    passengerId: 'user-1',
    passenger: mockUsers[0],
    pickupLocation: mockTrips[0].origin,
    dropoffLocation: mockTrips[0].destination,
    seats: 1,
    totalPrice: 15,
    status: 'confirmed',
    createdAt: '2026-06-12 10:30:00',
  },
  {
    id: 'order-2',
    tripId: 'trip-2',
    trip: mockTrips[1],
    passengerId: 'user-1',
    passenger: mockUsers[0],
    pickupLocation: mockTrips[1].origin,
    dropoffLocation: mockTrips[1].destination,
    seats: 1,
    totalPrice: 20,
    status: 'pending',
    createdAt: '2026-06-12 11:00:00',
  },
];
