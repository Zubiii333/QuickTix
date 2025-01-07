import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import CreateEventForm from '../components/CreateEventForm';
import type { Event, Ticket } from '../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [tickets, setTickets] = useState<(Ticket & { event: Event })[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ username: string } | null>(null);

  useEffect(() => {
    loadTickets();
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser(); // SELECT * FROM auth.users WHERE id = 'user_id'
      if (!user) return;

      const { data, error } = await supabase 
        .from('profiles')  // SELECT username, avatar_url FROM profiles
        .select('username') // SELECT username, avatar_url FROM profiles
        .eq('id', user.id) // WHERE id = 'user_id'
        .single(); 

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function loadTickets() {
    try {
      const { data: { user } } = await supabase.auth.getUser(); 
      if (!user) return;

      const { data, error } = await supabase
        .from('tickets')  // SELECT * FROM tickets
        .select(`  
          *,
          event:events(*) 
        `) // SELECT *, events.* FROM tickets JOIN events ON tickets.event_id = events.id
        .eq('user_email', user.email) // WHERE user_email = 'user_email'
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {profile?.username && (
            <p className="mt-2 text-lg text-gray-600">Hi, {profile.username}!</p>
          )}
        </div>
        <button
          onClick={() => setShowCreateEvent(!showCreateEvent)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showCreateEvent ? 'Hide Form' : 'Create Event'}
        </button>
      </div>

      {showCreateEvent && (
  <div className="mb-8 bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
    <CreateEventForm onSuccess={() => {
      setShowCreateEvent(false);
      loadTickets(); // Refresh the tickets list
    }} />
  </div>
)}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold">Your Tickets</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {ticket.event?.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {format(new Date(ticket.event?.date), 'PPP')} at {ticket.event?.location}
                    </p>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Total: ${ticket.total_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {ticket.payment_status === 'paid' ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Paid</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {tickets.length === 0 && (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                You haven't purchased any tickets yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}