import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isIdeaSaved, toggleIdea } from '../../lib/ideas.api'
import type { Trip } from '../../types'
import { Lightbulb } from 'lucide-react'

interface TripCardProps {
  trip: Trip
  showBulb?: boolean
}

const TripCard = ({ trip, showBulb = true }: TripCardProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const flagCount = 1 + (trip.stages?.length ?? 0)
  const [saved, setSaved] = useState(false)
  const isOwnTrip = user?.id === trip.user_id

  useEffect(() => {
    if (!user) return
    isIdeaSaved(user.id, trip.id).then(setSaved)
  }, [user, trip.id])

  const handleBulb = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return
    const newState = await toggleIdea(user.id, trip.id)
    setSaved(newState)
  }

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}`)}
      className="flex items-center gap-4 bg-card rounded-xl overflow-hidden border border-primary/20 hover:border-primary transition-colors cursor-pointer p-2"
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-background">
        {trip.cover_image_url ? (
          <img
            src={trip.cover_image_url}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center border border-primary/20 rounded-lg">
            <span className="text-2xl">🚩</span>
          </div>
        )}
      </div>

      {/* Info centre */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-black truncate">{trip.title}</p>
        {trip.date && (
          <p className="text-primary text-xs mt-0.5">
            {new Date(trip.date).getFullYear()}
          </p>
        )}
        <p className="text-gray-600 text-xs mt-1">
          {flagCount} {flagCount === 1 ? 'flag' : 'flags'}
        </p>
      </div>

{showBulb && !isOwnTrip && (
  <button
    onClick={handleBulb}
    className="px-2 shrink-0 transition-transform active:scale-125"
  >
    <Lightbulb
      size={24}
      fill={saved ? '#facc15' : 'none'}
      stroke={saved ? '#facc15' : 'white'}
      strokeWidth={1.5}
    />
  </button>
)}
    </div>
  )
}

export default TripCard