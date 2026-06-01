import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Home, Globe, Gamepad2, Target, Trophy, ShoppingBag,
  BarChart2, BookOpen, User, Shield, Users, Bell, LogOut,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { useState, useEffect } from 'react'
import api from '../lib/api'
import clsx from 'clsx'

export default function Layout() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    api.get('/notifications/?unread_only=true').then(({ data }) => setUnreadCount(data.length)).catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', icon: Home, label: t('dashboard') },
    { to: '/worlds', icon: Globe, label: t('worlds') },
    { to: '/missions', icon: Target, label: t('missions') },
    { to: '/achievements', icon: Trophy, label: t('achievements') },
    { to: '/rewards', icon: ShoppingBag, label: t('rewards') },
    { to: '/leaderboard', icon: BarChart2, label: t('leaderboard') },
    { to: '/story', icon: BookOpen, label: t('story') },
    { to: '/profile', icon: User, label: t('profile') },
  ]

  if (user?.role === 'parent' || user?.role === 'admin') {
    navItems.push({ to: '/parent', icon: Users, label: t('parent') })
  }
  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', icon: Shield, label: t('admin') })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎓</span>
            <div>
              <p className="font-bold text-sm text-gradient">{t('appName')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.display_name || user?.username}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="badge-xp">⚡ {user?.xp || 0} XP</span>
            <span className="badge-coins">🪙 {user?.coins || 0}</span>
          </div>
          <div className="mt-2 xp-bar">
            <div
              className="xp-fill"
              style={{ width: `${Math.min(100, ((user?.xp || 0) % 500) / 5)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Lv. {user?.level || 1}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-hide">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden glass border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-sm text-gradient">{t('appName')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-xp text-xs">⚡ {user?.xp || 0}</span>
            <span className="badge-coins text-xs">🪙 {user?.coins || 0}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-gray-200 dark:border-gray-700 z-30">
          <div className="flex justify-around px-1 py-1 overflow-x-auto scrollbar-hide">
            {navItems.slice(0, 6).map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'nav-link min-w-[52px]',
                    isActive && 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-gray-700'
                  )
                }
              >
                <Icon size={20} />
                <span className="text-[10px]">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
