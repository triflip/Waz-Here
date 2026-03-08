import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Globe from 'react-globe.gl'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const globeRef = useRef<{ controls: () => { autoRotate: boolean; autoRotateSpeed: number } }>(null)

  useEffect(() => {
    if (user) navigate(`/profile/${user.id}`)
  }, [user, navigate])

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.5
    }
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