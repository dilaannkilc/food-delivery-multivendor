

export const isPointInPolygon = (point, polygon) => {
  const x = point.longitude
  const y = point.latitude
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {

    const xi = polygon[i][0]
    const yi = polygon[i][1]
    const xj = polygon[j][0]
    const yj = polygon[j][1]

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

export const checkLocationInCities = (currentLocation, cities) => {
  if (!currentLocation) return null

  for (const city of cities) {
    if (city?.location?.coordinates?.[0]) {
      const isInside = isPointInPolygon(currentLocation, city.location.coordinates[0])

      if (isInside) {
        return city
      }
    }
  }
  return null
}
