import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTripsWithAuthors } from '../lib/trips.api'
import type { TripWithAuthor } from '../types'
import Globe, { type GlobeInstance } from 'react-globe.gl'

const WazMap = () => {
  const globeEl = useRef<GlobeInstance>(null)
  const navigate = useNavigate()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [trips, setTrips] = useState<TripWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const RESTART_DELAY = 4000

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllTripsWithAuthors()
        setTrips(data)
      } catch (err) {
        console.error('Error loading trips:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!globeEl.current) return

    const controls = globeEl.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    const stopRotation = () => {
      controls.autoRotate = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }

    const restartRotation = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        controls.autoRotate = true
      }, RESTART_DELAY)
    }

    controls.addEventListener('start', stopRotation)
    controls.addEventListener('end', restartRotation)

    return () => {
      controls.removeEventListener('start', stopRotation)
      controls.removeEventListener('end', restartRotation)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [loading])

  const createMarkerElement = (trip: TripWithAuthor) => {
    const el = document.createElement('div')
    el.style.pointerEvents = 'auto'
    el.style.cursor = 'pointer'
    el.style.position = 'relative'

    // Avatar de l'autor — inicial o foto
    const authorAvatar = trip.profile?.avatar_url
      ? `<img src="${trip.profile.avatar_url}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; border:1px solid #13ec49;" />`
      : `<div style="width:24px; height:24px; border-radius:50%; background:#0d1a0d; border:1px solid #13ec49; display:flex; align-items:center; justify-content:center; font-size:10px; color:white; font-weight:800;">${trip.profile?.full_name?.charAt(0) ?? '?'}</div>`

   el.innerHTML = `
  <div style="display:flex; align-items:flex-start;">
    <div style="width:2px; height:20px; background:#13ec49;"></div>
    <div style="
      width:0; height:0;
      border-top:8px solid transparent;
      border-bottom:8px solid transparent;
      border-left:12px solid #13ec49;
      margin-top:2px;
    "></div>
  </div>

  <div class="waz-tooltip" style="
    display:none;
    position:absolute;
    bottom:28px;
    left:50%;
    transform:translateX(-50%);
    background:#0d1a0d;
    border:1px solid rgba(19,236,73,0.3);
    border-radius:12px;
    padding:8px;
    width:150px;
    pointer-events:none;
    z-index:999;
  ">
    <!-- Autor a dalt -->
    <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid rgba(19,236,73,0.15);">
      ${authorAvatar}
      <p style="color:#13ec49; font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;">
        ${trip.profile?.full_name ?? ''}
      </p>
    </div>

    <!-- Títol -->
    <p style="color:white; font-size:11px; font-weight:800; margin-bottom:6px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
      ${trip.title}
    </p>

    <!-- Foto -->
    ${trip.cover_image_url ? `
      <img src="${trip.cover_image_url}"
        style="width:100%; height:80px; object-fit:cover; border-radius:8px; display:block;"
      />
    ` : `
      <div style="width:100%; height:80px; background:#050d05; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px;">🚩</div>
    `}
  </div>
`

    const tooltip = el.querySelector('.waz-tooltip') as HTMLElement

    el.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block'
      if (globeEl.current) {
        globeEl.current.controls().autoRotate = false
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    })

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none'
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        if (globeEl.current) globeEl.current.controls().autoRotate = true
      }, RESTART_DELAY)
    })

    el.addEventListener('click', () => {
      navigate(`/trip/${trip.id}`)
    })

    return el
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-primary tracking-widest animate-pulse">Loading...</p>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-background">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height * 0.70}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="#050d05"
        htmlElementsData={trips}
        htmlLat="latitude"
        htmlLng="longitude"
        htmlElement={(d) => createMarkerElement(d as TripWithAuthor)}
      />
    </div>
  )
}

export default WazMap