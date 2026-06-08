import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import MapPage from './pages/MapPage'
import ReportPage from './pages/ReportPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import LandingPage from './pages/LandingPage'
import 'leaflet/dist/leaflet.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={
            <ProtectedRoute><ReportPage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}