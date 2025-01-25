import type { DeliveryOrder, Vehicle } from '../types';

export class RouteOptimizer {
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  optimizeRoutes(
    orders: DeliveryOrder[],
    vehicles: Vehicle[],
    trafficData: { [key: string]: number }
  ): Map<string, DeliveryOrder[]> {
    const routes = new Map<string, DeliveryOrder[]>();
    const unassignedOrders = [...orders];

    // Sort vehicles by capacity
    const availableVehicles = vehicles
      .filter(v => v.status === 'available')
      .sort((a, b) => b.capacity - a.capacity);

    for (const vehicle of availableVehicles) {
      const vehicleRoute: DeliveryOrder[] = [];
      let currentLocation = vehicle.currentLocation;
      let remainingCapacity = vehicle.capacity;

      while (unassignedOrders.length > 0 && remainingCapacity > 0) {
        let bestOrder: DeliveryOrder | null = null;
        let bestDistance = Infinity;
        let bestIndex = -1;

        // Find the closest order that fits in the remaining capacity
        for (let i = 0; i < unassignedOrders.length; i++) {
          const order = unassignedOrders[i];
          if (order.weight <= remainingCapacity) {
            const distance = this.calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              order.latitude,
              order.longitude
            );

            // Consider traffic impact
            const trafficMultiplier =
              trafficData[`${order.latitude},${order.longitude}`] || 1;
            const adjustedDistance = distance * trafficMultiplier;

            if (adjustedDistance < bestDistance) {
              bestDistance = adjustedDistance;
              bestOrder = order;
              bestIndex = i;
            }
          }
        }

        if (bestOrder && bestIndex !== -1) {
          vehicleRoute.push(bestOrder);
          remainingCapacity -= bestOrder.weight;
          currentLocation = {
            latitude: bestOrder.latitude,
            longitude: bestOrder.longitude
          };
          unassignedOrders.splice(bestIndex, 1);
        } else {
          break;
        }
      }

      if (vehicleRoute.length > 0) {
        routes.set(vehicle.id, vehicleRoute);
      }
    }

    return routes;
  }
}