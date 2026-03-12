import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../lib/profile.api'
import { updateProfile } from '../lib/profile.api'
import { uploadImage } from '../lib/storage.api'
import { logoutUser } from '../lib/auth.api'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import type { Profile } from '../types'

const Settings = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '',
    city: '',
    description: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const data = await getProfile(user.id)
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          city: data.city || '',
          description: data.description || '',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      let avatarUrl = profile?.avatar_url

      if (avatarFile) {
        avatarUrl = await uploadImage('avatar', avatarFile, user.id)
      }

      await updateProfile(user.id, {
        full_name: formData.full_name,
        city: formData.city,
        description: formData.description,
        avatar_url: avatarUrl,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error logging out')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-primary tracking-widest animate-pulse">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
  <h1 className="text-2xl font-black uppercase italic tracking-tight">
    Settings
  </h1>
  <button
    onClick={handleLogout}
    className="w-9 h-9 rounded-full border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center text-xs font-black"
  >
    logout
  </button>
</div>

        <div className="flex flex-col items-center gap-3">
          <label className="cursor-pointer relative">
            <Avatar
              url={avatarPreview || profile?.avatar_url}
              name={formData.full_name}
              size="lg"
            />
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-background text-xs font-black">
              +
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              className="hidden"
            />
          </label>
          <p className="text-gray-600 text-xs">Tap to change avatar</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black text-primary uppercase tracking-widest">
              Full name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-card border border-primary/20 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-black text-primary uppercase tracking-widest">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-card border border-primary/20 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-black text-primary uppercase tracking-widest">
              Bio
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell the world who you are..."
              rows={4}
              className="w-full bg-card border border-primary/20 focus:border-primary text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-colors mt-2 resize-none"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-primary text-sm text-center font-bold">Profile updated!  ✓</p>}

        <Button variant="primary" fullWidth onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>

    </div>
  )
}

export default Settings