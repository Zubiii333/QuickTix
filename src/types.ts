export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  available_tickets: number;
  created_by: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  quantity: number;
  total_price: number;
  payment_status: 'pending' | 'paid';
  created_at: string;
  event?: Event;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}