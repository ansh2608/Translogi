import React, { useState } from 'react';
import { Package, MapPin, Weight, Clock } from 'lucide-react';
import type { DeliveryOrder } from '../types';

interface NewOrderFormProps {
  onSubmit: (order: Omit<DeliveryOrder, 'id' | 'status'>) => void;
}

export const NewOrderForm: React.FC<NewOrderFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    latitude: '',
    longitude: '',
    weight: '',
    priority: 'medium' as const,
    timeWindowStart: '',
    timeWindowEnd: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customerName: formData.customerName,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      weight: parseFloat(formData.weight),
      priority: formData.priority,
      timeWindow: {
        start: formData.timeWindowStart,
        end: formData.timeWindowEnd
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">New Delivery Order</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Package className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={formData.customerName}
              onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <MapPin className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={e => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={e => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Weight (kg)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Weight className="w-5 h-5" />
            </span>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Window Start
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Clock className="w-5 h-5" />
            </span>
            <input
              type="datetime-local"
              value={formData.timeWindowStart}
              onChange={e => setFormData(prev => ({ ...prev, timeWindowStart: e.target.value }))}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Window End
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Clock className="w-5 h-5" />
            </span>
            <input
              type="datetime-local"
              value={formData.timeWindowEnd}
              onChange={e => setFormData(prev => ({ ...prev, timeWindowEnd: e.target.value }))}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Order
        </button>
      </div>
    </form>
  );
};