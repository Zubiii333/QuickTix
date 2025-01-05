import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface CreateEventFormProps {
  onSuccess: () => void;
}

export default function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const form = e.currentTarget;
    const formData = new FormData(form);
  
    try {
      const { data: { user } } = await supabase.auth.getUser ();
      if (!user) throw new Error('User  not authenticated');
  
      const eventData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
        price: Number(formData.get('price')),
        available_tickets: Number(formData.get('available_tickets')),
        created_by: user.id
      };
  
      const { error: insertError } = await supabase
        .from('events')
        .insert([eventData]);
  
      if (insertError) throw insertError;
      
      // Call onSuccess to refresh the events list
      onSuccess();
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="datetime-local"
          name="date"
          id="date"
          required
          min={new Date().toISOString().slice(0, 16)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          name="price"
          id="price"
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="available_tickets" className="block text-sm font-medium text-gray-700">
          Available Tickets
        </label>
        <input
          type="number"
          name="available_tickets"
          id="available_tickets"
          min="1"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}