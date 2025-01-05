import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import EventCard from '../components/EventCard';
import PaymentModal from '../components/PaymentModal';
import type { Event } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      let { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString()) // Only future events
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBookTicket = async (event: Event) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setSelectedEvent(event);
  };

  const handlePaymentComplete = async () => {
    if (!selectedEvent) return;
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
  
      const ticketData = {
        event_id: selectedEvent.id,
        user_email: user.email,
        total_price: selectedEvent.price,
        payment_status: 'paid',
      };
  
      const { error: ticketError } = await supabase
        .from('tickets')
        .insert([ticketData]);
  
      if (ticketError) throw ticketError;
  
      const { error: eventError } = await supabase
        .from('events')
        .update({ available_tickets: selectedEvent.available_tickets - 1 })
        .eq('id', selectedEvent.id);
  
      if (eventError) throw eventError;
  
      await loadEvents();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking ticket:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No upcoming events available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBookTicket={handleBookTicket}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <PaymentModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}