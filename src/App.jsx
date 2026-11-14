import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ClientDashboard from './pages/ClientDashboard.jsx'
import ReviewerDashboard from './pages/ReviewerDashboard.jsx'

const home = (role) => (role === 'reviewer' ? '/reviewer' : '/client')

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-10 text-slate-500">Loading...</div>
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={home(user.role)} replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to={home(user.role)} replace /> : <SignupPage />} />
      <Route path="/client" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/reviewer" element={<ProtectedRoute role="reviewer"><ReviewerDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? home(user.role) : '/login'} replace />} />
    </Routes>
  )
}
