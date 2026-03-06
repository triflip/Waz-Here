
import { useNavigate, useLocation } from "react-router-dom";
import {useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } =useAuth()

    const isActive = (path:string) => location.pathname.startsWith(path)
    
    const items = [
    { label: 'My World', icon: '🌍', path: '/my-world' },
    { label: 'Profile',  icon: '👤', path: `/profile/${user?.id}` },
    { label: '',         icon: '+',  path: '/add-flag', isMain: true },
    { label: 'Explore',  icon: '🗺️', path: '/waz-map' },
    { label: 'Settings', icon: '⚙️', path: '/settings' },
  ]

   return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-900 px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => (

          item.isMain ? (
    
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center text-black text-2xl font-bold transition-all duration-300 shadow-lg shadow-green-500/30"
            >
              {item.icon}
            </button>
          ) : (
     
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-3 py-1 group"
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs transition-colors ${
                isActive(item.path) ? 'text-green-500' : 'text-gray-600 group-hover:text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          )
        ))}
      </div>
    </nav>
  )
}

export default Navbar
