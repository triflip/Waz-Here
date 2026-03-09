export interface LocationInfo {
  city: string
  country: string
  display_name: string
}

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<LocationInfo> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'WazHere/1.0',
      },
    }
  )

  if (!response.ok) throw new Error('Error getting location info')

  const data = await response.json()

  return {
    city: data.address?.city || data.address?.town || data.address?.village || '',
    country: data.address?.country || '',
    display_name: data.display_name || '',
  }
}

export const geocode = async (
  query: string
): Promise<{ lat: number; lng: number } | null> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
    {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'WazHere/1.0',
      },
    }
  )

  if (!response.ok) throw new Error('Error searching location')

  const data = await response.json()
  if (!data.length) return null

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  }
}