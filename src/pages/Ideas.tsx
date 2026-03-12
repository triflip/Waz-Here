import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getIdeasByUser } from '../lib/ideas.api'
import TripCard from '../components/ui/TripCard'
import type { Trip } from '../types'

const Ideas = () => {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const data = await getIdeasByUser(user.id)
        setTrips(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading ideas')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-primary tracking-widest animate-pulse">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-black uppercase italic tracking-tight">
          Ideas 💡
        </h1>
        <p className="text-gray-600 text-xs mt-1">
          Trips that inspire you
        </p>
      </div>

      <div className="px-6 pb-24">
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">💡</p>
            <p className="text-gray-600 text-sm">No saved trips yet</p>
            <p className="text-gray-700 text-xs mt-2">
              Tap the 💡 on any trip to save it here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Ideas