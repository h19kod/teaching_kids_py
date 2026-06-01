import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'
import { Zap, Coins, Star, Gem, Flame, Trophy, Target, TrendingUp } from 'lucide-react'

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6']

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, refreshUser } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/stats/overview'),
      api.get('/adaptive/recommendations'),
    ]).then(([s, r]) => {
      setStats(s.data)
      setRecommendations(r.data.recommended_games || [])
    }).finally(() => setLoading(false))
    refreshUser()
  }, [])

  const xpForLevel = ((user?.xp || 0) % 500)
  const xpProgress = Math.min(100, (xpForLevel / 500) * 100)

  const statCards = [
    { icon: '⚡', label: 'XP', value: user?.xp || 0, color: 'from-purple-500 to-indigo-600', textColor: 'text-purple-600' },
    { icon: '🪙', label: t('coins'), value: user?.coins || 0, color: 'from-yellow-400 to-orange-500', textColor: 'text-yellow-600' },
    { icon: '⭐', label: t('stars'), value: user?.stars || 0, color: 'from-blue-400 to-blue-600', textColor: 'text-blue-600' },
    { icon: '💎', label: t('gems'), value: user?.gems || 0, color: 'from-pink-400 to-rose-500', textColor: 'text-pink-600' },
    { icon: '🔥', label: 'Streak', value: `${user?.streak_days || 0}d`, color: 'from-orange-400 to-red-500', textColor: 'text-orange-600' },
    { icon: '🏅', label: t('level'), value: user?.level || 1, color: 'from-emerald-400 to-teal-600', textColor: 'text-emerald-600' },
  ]

  const chartData = [
    { name: 'Games', value: stats?.overall?.games_played || 0 },
    { name: 'XP', value: Math.floor((stats?.overall?.total_xp || 0) / 10) },
    { name: 'Accuracy', value: stats?.overall?.accuracy || 0 },
    { name: 'Score', value: Math.floor(stats?.overall?.avg_score || 0) },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-4">🎮</div>
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('welcome')}، <span className="text-gradient">{user?.display_name || user?.username}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {t('level')} {user?.level} · {user?.role === 'admin' ? '👑 Admin' : user?.role === 'parent' ? '👨‍👩‍👧 Parent' : '🧒 Child'}
          </p>
        </div>
        <div className="text-5xl animate-float">{user?.avatar || '🦁'}</div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">
            {t('level')} {user?.level} → {(user?.level || 1) + 1}
          </span>
          <span className="text-xs font-bold text-purple-600">{Math.round(xpProgress)}%</span>
        </div>
        <div className="xp-bar h-4">
          <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{xpForLevel} / 500 XP</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="card text-center p-3">
            <div className={`text-2xl mb-1`}>{s.icon}</div>
            <div className={`font-bold text-lg ${s.textColor}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-500" /> إحصائياتك
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Target size={18} className="text-indigo-500" /> ملخص الأداء
          </h3>
          <div className="space-y-3">
            {[
              { label: 'الألعاب المكتملة', value: stats?.overall?.games_played || 0, icon: '🎮' },
              { label: 'متوسط الدقة', value: `${stats?.overall?.accuracy || 0}%`, icon: '🎯' },
              { label: 'متوسط النتيجة', value: `${stats?.overall?.avg_score || 0}%`, icon: '📊' },
              { label: 'الإنجازات', value: stats?.achievements_earned || 0, icon: '🏆' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.icon} {item.label}</span>
                <span className="font-bold text-gray-800 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" /> موصى به لك
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendations.slice(0, 3).map((rec) => (
              <button
                key={rec.game_id}
                onClick={() => navigate(`/games/${rec.game_id}/play`)}
                className="card-hover flex items-center gap-3 text-right"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl">
                  🎮
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-white">{rec.game_name}</p>
                  <p className="text-xs text-gray-400">
                    صعوبة {rec.suggested_difficulty} · {rec.reason === 'needs_practice' ? '💪 يحتاج تدريب' : '🌟 عام'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {stats?.recent_activity?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">⏱ آخر النشاطات</h3>
          <div className="card divide-y divide-gray-100 dark:divide-gray-700">
            {stats.recent_activity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎮</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">لعبة #{a.game_id}</p>
                    <p className="text-xs text-gray-400">{new Date(a.completed_at).toLocaleDateString('ar')}</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className="badge-xp">+{a.xp_earned} XP</span>
                  <p className="text-xs text-gray-400 mt-0.5">{Math.round(a.score)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
