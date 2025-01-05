import React from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onBookTicket: (event: Event) => void;
}

export default function EventCard({ event, onBookTicket }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-5 w-5 mr-2" />
            {format(new Date(event.date), 'PPP')}
          </div>
          
          <div className="flex items-center text-gray-500">
            <MapPin className="h-5 w-5 mr-2" />
            {event.location}
          </div>
          
          <div className="flex items-center text-gray-500">
            <Ticket className="h-5 w-5 mr-2" />
            {event.available_tickets} tickets available
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${event.price.toFixed(2)}
          </span>
          <button
            onClick={() => onBookTicket(event)}
            disabled={event.available_tickets === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}