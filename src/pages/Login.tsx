// src/pages/Login.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/auth.api'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Un sol handler per tots els camps — llegeix el "name" de l'input
  // i actualitza només aquell camp al formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await loginUser(formData.email, formData.password)
      navigate('/profile/${user.id}') 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">

      <h1 className="text-4xl font-bold text-white tracking-widest mb-2">
        WAZ HERE
      </h1>
      <p className="text-green-500 text-xs tracking-[0.3em] uppercase mb-10">
        Plant your flag. Own your journey.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus:border-green-500 text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus:border-green-500 text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-full transition-all duration-300 mt-2"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-gray-600 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-500 hover:text-green-400">
            Create one
          </Link>
        </p>

      </form>
    </div>
  )
}

export default Login