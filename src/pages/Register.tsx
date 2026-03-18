import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../lib/auth.api'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    city: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await registerUser(
        formData.email,
        formData.password,
        formData.fullName,
        formData.city
      )
      navigate(`/profile/${user.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error in the register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      
      <h1 className="text-4xl font-bold text-white tracking-widest mb-2">
        WAZ HERE
      </h1>
      <p className="text-primary text-xs tracking-[0.3em] uppercase mb-10">
        Plant your flag
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus: text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        <input
          type="text"
          name="city"
          placeholder="Your city"
          value={formData.city}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus:border-primary text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus:border-primary text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-transparent border border-green-900 focus:border-primary text-white placeholder-gray-600 rounded-lg px-4 py-3 outline-none transition-colors"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3 rounded-full transition-all duration-300 mt-2"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-gray-600 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-green-400">
            Login
          </Link>
        </p>

      </form>
    </div>
  )
}

export default Register