export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculatePrice(distance: number, basePrice: number = 5): number {
  const perKmRate = 1.5;
  const baseDistance = 3;
  if (distance <= baseDistance) {
    return basePrice;
  }
  return basePrice + (distance - baseDistance) * perKmRate;
}

export function calculateDetour(
  tripOrigin: { latitude: number; longitude: number },
  tripDestination: { latitude: number; longitude: number },
  pickup: { latitude: number; longitude: number },
  dropoff: { latitude: number; longitude: number }
): number {
  const directDistance = calculateDistance(
    tripOrigin.latitude,
    tripOrigin.longitude,
    tripDestination.latitude,
    tripDestination.longitude
  );

  const withPickupDistance =
    calculateDistance(
      tripOrigin.latitude,
      tripOrigin.longitude,
      pickup.latitude,
      pickup.longitude
    ) +
    calculateDistance(
      pickup.latitude,
      pickup.longitude,
      dropoff.latitude,
      dropoff.longitude
    ) +
    calculateDistance(
      dropoff.latitude,
      dropoff.longitude,
      tripDestination.latitude,
      tripDestination.longitude
    );

  return Math.max(0, withPickupDistance - directDistance);
}
