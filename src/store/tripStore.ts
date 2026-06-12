import { create } from 'zustand';
import { Trip } from '../types';
import { mockTrips } from '../data/mockTrips';

interface TripState {
  trips: Trip[];
  publishedTrips: Trip[];
  appliedTrips: Trip[];
  fetchTrips: () => void;
  publishTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  applyForTrip: (tripId: string) => void;
  cancelTrip: (tripId: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  publishedTrips: [],
  appliedTrips: [],

  fetchTrips: () =>
    set({
      trips: mockTrips,
      publishedTrips: mockTrips.filter((t) => t.driverId === 'user-1'),
      appliedTrips: mockTrips.filter((t) => t.id === 'trip-1'),
    }),

  publishTrip: (trip) =>
    set((state) => {
      const newTrip: Trip = {
        ...trip,
        id: `trip-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return {
        trips: [newTrip, ...state.trips],
        publishedTrips: [newTrip, ...state.publishedTrips],
      };
    }),

  applyForTrip: (tripId) =>
    set((state) => {
      const trip = state.trips.find((t) => t.id === tripId);
      if (trip && trip.availableSeats > 0) {
        return {
          trips: state.trips.map((t) =>
            t.id === tripId ? { ...t, availableSeats: t.availableSeats - 1 } : t
          ),
          appliedTrips: [...state.appliedTrips, trip],
        };
      }
      return state;
    }),

  cancelTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === tripId ? { ...t, status: 'cancelled' as const } : t
      ),
      publishedTrips: state.publishedTrips.filter((t) => t.id !== tripId),
      appliedTrips: state.appliedTrips.filter((t) => t.id !== tripId),
    })),
}));
