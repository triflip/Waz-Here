export interface Profile {
  id: string
  full_name: string
  city: string
  avatar_url: string
  description: string
  created_at: string
}

export interface Stage {
  title: string
  description: string
  images: TripImage[]
}

export interface TripImage {
    url: string
    caption: string
}

export interface Trip {
  id: string
  user_id: string
  title: string
  description: string
  cover_image_url: string
  images: TripImage[] 
  stages: Stage[]
  latitude: number
  longitude: number
  date: string | null
  created_at: string
}

export interface Idea {
  id: string
  user_id: string
  trip_id: string
  created_at: string
}