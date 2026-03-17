import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Globe from 'react-globe.gl'
import { getAllTrips } from '../lib/trips.api'
import { type GlobeInstance } from 'react-globe.gl'
import type { Trip } from '../types'

const Landing = () => {
  const navigate = useNavigate()
  const globeRef = useRef<GlobeInstance>(null)
  const [trips, setTrips] = useState<Trip[]>([])


  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.5
    }
  }, [])

  useEffect(() => {
    getAllTrips().then(setTrips).catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-between py-12 overflow-hidden">

      <div className="flex flex-col items-center z-10">
        <h1 className="text-6xl font-bold text-white tracking-widest">
          WAZ HERE
        </h1>
        <p className="text-primary text-sm tracking-[0.3em] mt-2 uppercase">
          Plant your flag. Own your journey.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="rgba(0,0,0,0)"
          width={350}
          height={350}
          htmlElementsData={trips}
          htmlLat="latitude"
          htmlLng="longitude"
          htmlElement={() => {
            const el = document.createElement('div')
            el.style.pointerEvents = 'none'
            el.innerHTML = `
              <div style="display:flex; align-items:flex-start;">
                <div style="width:2px; height:14px; background:#13ec49;"></div>
                <div style="
                  width:0; height:0;
                  border-top:6px solid transparent;
                  border-bottom:6px solid transparent;
                  border-left:9px solid #13ec49;
                  margin-top:1px;
                "></div>
              </div>
            `
            return el
          }}
        />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs px-6 z-10">
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition-all duration-300"
        >
          Create Account
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full border border-primary text-primary hover:bg-green-500 hover:text-black font-bold py-3 rounded-full transition-all duration-300"
        >
          Login
        </button>
      </div>

    </div>
  )
}

export default Landing