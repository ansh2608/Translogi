export interface DeliveryOrder {
  id: string;
  customerName: string;
  address: string;
  latitude: number;
  longitude: number;
  weight: number;
  priority: 'low' | 'medium' | 'high';
  timeWindow: {
    start: string;
    end: string;
  };
  status: 'pending' | 'in-progress' | 'delivered';
  estimatedDeliveryTime?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  status: 'available' | 'busy';
  currentRoute?: DeliveryOrder[];
}

export interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
}

export interface TrafficData {
  congestionLevel: number;
  averageSpeed: number;
  incidents: string[];
}

export interface OperationalMetrics {
  totalDeliveries: number;
  onTimeDeliveries: number;
  averageDeliveryTime: number;
  vehicleUtilization: number;
  fuelEfficiency: number;
}