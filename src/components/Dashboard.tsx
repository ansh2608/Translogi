import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Truck, Package, Clock, Fuel, BarChart3 } from 'lucide-react';
import type { OperationalMetrics, DeliveryOrder, Vehicle } from '../types';

interface DashboardProps {
  metrics: OperationalMetrics;
  activeDeliveries: DeliveryOrder[];
  vehicles: Vehicle[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  activeDeliveries,
  vehicles
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">TransLogi Dashboard</h1>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<Package className="w-6 h-6" />}
          title="Total Deliveries"
          value={metrics.totalDeliveries}
        />
        <MetricCard
          icon={<Clock className="w-6 h-6" />}
          title="On-Time Deliveries"
          value={`${(metrics.onTimeDeliveries / metrics.totalDeliveries * 100).toFixed(1)}%`}
        />
        <MetricCard
          icon={<Truck className="w-6 h-6" />}
          title="Vehicle Utilization"
          value={`${metrics.vehicleUtilization.toFixed(1)}%`}
        />
        <MetricCard
          icon={<Fuel className="w-6 h-6" />}
          title="Fuel Efficiency"
          value={`${metrics.fuelEfficiency.toFixed(2)} km/L`}
        />
      </div>

      {/* Map View */}
      <div className="mb-8 h-[400px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {vehicles.map(vehicle => (
            <Marker
              key={vehicle.id}
              position={[vehicle.currentLocation.latitude, vehicle.currentLocation.longitude]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{vehicle.name}</h3>
                  <p>Status: {vehicle.status}</p>
                  <p>Capacity: {vehicle.capacity}kg</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Active Deliveries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeDeliveries.map(delivery => (
                <tr key={delivery.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {delivery.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.estimatedDeliveryTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
}> = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);