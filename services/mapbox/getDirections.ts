export async function getDrivingDirections(start: [number, number], end: [number, number]) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json.routes || !json.routes[0]) {
    throw new Error("No route found");
  }

  const route = json.routes[0];

  return {
    coordinates: route.geometry.coordinates as [number, number][],
    duration: route.duration,
    distance: route.distance,
  };
}
