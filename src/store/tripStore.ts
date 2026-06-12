import { create } from 'zustand';
import { Trip } from '../types';
import { mockTrips } from '../data/mockTrips';

interface TripState {
  trips: Trip[];
  publishedTrips: Trip[];
  appliedTrips: Trip[];
  fetchTrips: () => void;
  publishTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  applyForTrip: (tripId: string, seats?: number) => void;
  cancelTrip: (tripId: string) => void;
  updateTripSeats: (tripId: string, seatsToReduce: number) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  publishedTrips: [],
  appliedTrips: [],

  fetchTrips: () => {
    const allTrips = mockTrips;
    set({
      trips: allTrips,
      publishedTrips: allTrips.filter((t) => t.driverId === 'user-1'),
      appliedTrips: [],
    });
  },

  publishTrip: (trip) => {
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      trips: [newTrip, ...state.trips],
      publishedTrips: [newTrip, ...state.publishedTrips],
    }));
  },

  applyForTrip: (tripId, seats = 1) => {
    set((state) => {
      const tripIndex = state.trips.findIndex((t) => t.id === tripId);
      if (tripIndex === -1) return state;
      
      const trip = state.trips[tripIndex];
      if (trip.availableSeats < seats) return state;

      const updatedTrips = [...state.trips];
      updatedTrips[tripIndex] = {
        ...trip,
        availableSeats: trip.availableSeats - seats,
      };

      return {
        trips: updatedTrips,
        appliedTrips: [...state.appliedTrips, { ...trip, availableSeats: trip.availableSeats - seats }],
      };
    });
  },

  cancelTrip: (tripId) => {
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === tripId ? { ...t, status: 'cancelled' as const } : t
      ),
      publishedTrips: state.publishedTrips.filter((t) => t.id !== tripId),
      appliedTrips: state.appliedTrips.filter((t) => t.id !== tripId),
    }));
  },

  updateTripSeats: (tripId, seatsToReduce) => {
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === tripId ? { ...t, availableSeats: Math.max(0, t.availableSeats - seatsToReduce) } : t
      ),
    }));
  },
}));
