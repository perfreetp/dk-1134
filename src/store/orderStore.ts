import { create } from 'zustand';
import { Order, Trip } from '../types';
import { mockOrders } from '../data/mockOrders';

interface OrderState {
  orders: Order[];
  fetchOrders: () => void;
  createOrder: (trip: Trip, seats: number, userId: string) => Order;
  cancelOrder: (orderId: string) => void;
  confirmOrder: (orderId: string) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],

  fetchOrders: () => {
    set({ orders: mockOrders });
  },

  createOrder: (trip, seats, userId) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tripId: trip.id,
      trip: {
        ...trip,
        availableSeats: trip.availableSeats - seats,
      },
      passengerId: userId,
      pickupLocation: trip.origin,
      dropoffLocation: trip.destination,
      seats,
      totalPrice: trip.pricePerSeat * seats,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
    }));

    return newOrder;
  },

  cancelOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      ),
    }));
  },

  confirmOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status: 'confirmed' as const } : order
      ),
    }));
  },

  getOrdersByStatus: (status) => {
    return get().orders.filter((order) => order.status === status);
  },
}));
