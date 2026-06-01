import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import useAuthStore from './store/useAuthStore'

import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import WorldsPage from './pages/WorldsPage'
import GamesPage from './pages/GamesPage'
import GamePlayPage from './pages/GamePlayPage'
import MissionsPage from './pages/MissionsPage'
import AchievementsPage from './pages/AchievementsPage'
import RewardsPage from './pages/RewardsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import StoryPage from './pages/StoryPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import ParentPage from './pages/ParentPage'

function PrivateRoute({ children, roles }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (user?.dark_mode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    const lang = user?.preferred_language || 'ar'
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [user])

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="worlds" element={<WorldsPage />} />
          <Route path="worlds/:subjectId/games" element={<GamesPage />} />
          <Route path="games/:gameId/play" element={<GamePlayPage />} />
          <Route path="missions" element={<MissionsPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="story" element={<StoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="parent"
            element={
              <PrivateRoute roles={['admin', 'parent']}>
                <ParentPage />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
