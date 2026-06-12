import { create } from 'zustand';
import { User, Location } from '../types';
import { currentUser as defaultUser } from '../data/mockUsers';

interface UserState {
  currentUser: User | null;
  locations: Location[];
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  setDefaultLocation: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: defaultUser,
  locations: [
    {
      id: 'default-home',
      name: '家',
      address: '北京市昌平区龙泽苑',
      latitude: 40.0721,
      longitude: 116.3197,
      isDefault: true,
    },
    {
      id: 'default-work',
      name: '公司',
      address: '北京市海淀区中关村软件园',
      latitude: 40.0515,
      longitude: 116.3125,
      isDefault: false,
    },
  ],
  isLoggedIn: true,

  login: (user) =>
    set({
      currentUser: user,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      currentUser: null,
      isLoggedIn: false,
    }),

  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location],
    })),

  removeLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== id),
    })),

  setDefaultLocation: (id) =>
    set((state) => ({
      locations: state.locations.map((loc) => ({
        ...loc,
        isDefault: loc.id === id,
      })),
    })),
}));
