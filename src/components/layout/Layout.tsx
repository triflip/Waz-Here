
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from './Navbar'

const NO_NAVBAR_ROUTES = ['/', '/login', '/register']

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const { user } = useAuth()

  const showNavbar = user && !NO_NAVBAR_ROUTES.includes(location.pathname)

  return (
    <div className="min-h-screen bg-black">
      <main className={showNavbar ? 'pb-20' : ''}>
        {children}
      </main>

      {showNavbar && <Navbar />}
    </div>
  )
}

export default Layout