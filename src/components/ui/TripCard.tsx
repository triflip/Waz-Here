// src/components/ui/TripCard.tsx

import { useNavigate } from 'react-router-dom'
import type { Trip } from '../../types'

interface TripCardProps {
  trip: Trip
  showBulb?: boolean  // mostrem la bombeta o no
}

const TripCard = ({ trip, showBulb = true }: TripCardProps) => {
  const navigate = useNavigate()
  const flagCount = 1 + (trip.stages?.length ?? 0)

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}`)}
      className="flex items-center gap-4 bg-card rounded-xl overflow-hidden border border-primary/20 hover:border-primary transition-colors cursor-pointer p-2"
    >
      {/* Foto esquerra */}
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

      {/* Bombeta dreta — TODO: lògica real al Dia 10 */}
      {showBulb && (
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-2xl px-2 shrink-0"
        >
          💡
        </button>
      )}
    </div>
  )
}

export default TripCard