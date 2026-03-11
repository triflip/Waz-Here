
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTrips } from '../lib/trips.api'
import type { Trip } from '../types'
import Globe, { type GlobeInstance } from 'react-globe.gl'

const WazMap = () => {
const globeEl = useRef<GlobeInstance>(null)
  const navigate = useNavigate()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const RESTART_DELAY = 4000

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllTrips()
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

  // Auto-rotate + drag listeners
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
  }, [loading]) // <- re-executa quan els trips estan carregats

  // Crea el marcador HTML per cada trip
  const createMarkerElement = (trip: Trip) => {
    const el = document.createElement('div')
    el.style.pointerEvents = 'auto'
    el.style.cursor = 'pointer'
    el.style.position = 'relative'

    // Marcador — bandera verda
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

      <!-- Tooltip -->
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
        width:140px;
        pointer-events:none;
        z-index:999;
      ">
        ${trip.cover_image_url ? `
          <img src="${trip.cover_image_url}"
            style="width:100%; height:80px; object-fit:cover; border-radius:8px; display:block;"
          />
        ` : `
          <div style="width:100%; height:80px; background:#050d05; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px;">🚩</div>
        `}
        <p style="color:white; font-size:11px; font-weight:800; margin-top:6px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${trip.title}
        </p>
      </div>
    `

    const tooltip = el.querySelector('.waz-tooltip') as HTMLElement

    // Hover — mostra tooltip i atura rotació
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

    // Clic → navega al TripDetail
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
        htmlElement={(trip) => createMarkerElement(trip as Trip)}
      />
    </div>
  )
}

export default WazMap