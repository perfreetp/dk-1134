export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  creditScore: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Location {
  id: string;
  userId?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface Trip {
  id: string;
  driverId: string;
  driver?: User;
  origin: Location;
  destination: Location;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  detourDistance: number;
  status: 'active' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurringPattern?: string;
  notes?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  tripId: string;
  trip?: Trip;
  passengerId: string;
  passenger?: User;
  pickupLocation: Location;
  dropoffLocation: Location;
  seats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'tripCard' | 'system';
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantUsers?: User[];
  lastMessage?: Message;
  unreadCount: number;
  tripId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface InvoiceSettings {
  title: string;
  taxNumber?: string;
  notes: string[];
}

export type SortOption = 'time' | 'detour' | 'credit';
