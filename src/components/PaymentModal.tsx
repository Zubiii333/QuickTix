import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { PaymentDetails, Event } from '../types';

interface PaymentModalProps {
  event: Event;
  onClose: () => void;
  onPaymentComplete: () => void;
}

export default function PaymentModal({ event, onClose, onPaymentComplete }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onPaymentComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={paymentDetails.name}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              required
              maxLength={16}
              pattern="\d{16}"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                maxLength={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={paymentDetails.expiryDate}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                required
                maxLength={3}
                pattern="\d{3}"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={paymentDetails.cvv}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay $${event.price.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}