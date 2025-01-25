import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Truck, Package, BarChart3 } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { NewOrderForm } from './components/NewOrderForm';
import { DeliveryPredictor } from './utils/prediction';
import { RouteOptimizer } from './utils/routeOptimizer';
import type { DeliveryOrder, Vehicle, OperationalMetrics } from './types';

const predictor = new DeliveryPredictor();
const optimizer = new RouteOptimizer();

function App() {
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [metrics, setMetrics] = useState<OperationalMetrics>({
    totalDeliveries: 0,
    onTimeDeliveries: 0,
    averageDeliveryTime: 0,
    vehicleUtilization: 0,
    fuelEfficiency: 0
  });

  useEffect(() => {
    // Initialize predictor
    predictor.initialize();

    // Initialize mock data
    setVehicles([
      {
        id: 'v1',
        name: 'Truck 1',
        capacity: 1000,
        currentLocation: { latitude: 51.505, longitude: -0.09 },
        status: 'available'
      },
      {
        id: 'v2',
        name: 'Truck 2',
        capacity: 800,
        currentLocation: { latitude: 51.51, longitude: -0.1 },
        status: 'available'
      }
    ]);

    setMetrics({
      totalDeliveries: 150,
      onTimeDeliveries: 142,
      averageDeliveryTime: 45,
      vehicleUtilization: 85,
      fuelEfficiency: 8.5
    });
  }, []);

  const handleNewOrder = async (order: Omit<DeliveryOrder, 'id' | 'status'>) => {
    const newOrder: DeliveryOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      status: 'pending',
      estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    };

    // Predict delivery time
    const prediction = await predictor.predictDeliveryTime({
      distance: 10, // Calculate actual distance
      weight: order.weight,
      trafficLevel: 0.5, // Get from API
      weatherCondition: 0.8, // Get from API
      timeOfDay: new Date().getHours() / 24,
      priority: order.priority === 'high' ? 1 : order.priority === 'medium' ? 0.5 : 0
    });

    // Optimize routes
    const optimizedRoutes = optimizer.optimizeRoutes(
      [...activeDeliveries, newOrder],
      vehicles,
      {} // Traffic data
    );

    // Update active deliveries
    setActiveDeliveries(prev => [...prev, newOrder]);

    // Update vehicles with new routes
    setVehicles(prev =>
      prev.map(vehicle => ({
        ...vehicle,
        currentRoute: optimizedRoutes.get(vehicle.id),
        status: optimizedRoutes.get(vehicle.id) ? 'busy' : 'available'
      }))
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Truck className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">TransLogi</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/new-order"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    New Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-10">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  metrics={metrics}
                  activeDeliveries={activeDeliveries}
                  vehicles={vehicles}
                />
              }
            />
            <Route
              path="/new-order"
              element={<NewOrderForm onSubmit={handleNewOrder} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;