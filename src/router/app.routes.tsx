import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/layout/ProtectedRoute'

// Pàgines públiques
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import WazMap from '../pages/WazMap'
import TripDetail from '../pages/TripDetail'

// Pàgines protegides
import MyWorld from '../pages/MyWorld'
import Profile from '../pages/Profile'
import AddFlag from '../pages/AddFlag'
import EditTrip from '../pages/EditTrip'
import Ideas from '../pages/Ideas'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutes públiques */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/waz-map" element={<WazMap />} />
          <Route path="/trip/:id" element={<TripDetail />} />

          {/* Rutes protegides */}
          <Route path="/my-world" element={
            <ProtectedRoute><MyWorld /></ProtectedRoute>
          } />
          <Route path="/profile/:id" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/add-flag" element={
            <ProtectedRoute><AddFlag /></ProtectedRoute>
          } />
          <Route path="/edit-trip/:id" element={
            <ProtectedRoute><EditTrip /></ProtectedRoute>
          } />
          <Route path="/ideas" element={
            <ProtectedRoute><Ideas /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes