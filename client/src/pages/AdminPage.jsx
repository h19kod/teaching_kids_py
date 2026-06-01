import { useEffect, useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Users, Gamepad2, Trophy, BarChart2, ToggleLeft, ToggleRight, Shield } from 'lucide-react'
import clsx from 'clsx'

export default function AdminPage() {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  const loadOverview = () => api.get('/stats/admin/overview').then(({ data }) => setOverview(data))
  const loadUsers = () => api.get('/users/').then(({ data }) => setUsers(data))

  useEffect(() => {
    Promise.all([loadOverview(), loadUsers()]).finally(() => setLoading(false))
  }, [])

  const toggleUser = async (userId, isActive) => {
    try {
      const { data } = await api.put(`/users/${userId}/toggle-active`)
      toast.success(data.message)
      loadUsers()
    } catch {
      toast.error('فشل التحديث')
    }
  }

  const ROLE_BADGE = { admin: 'bg-red-100 text-red-700', parent: 'bg-blue-100 text-blue-700', child: 'bg-green-100 text-green-700' }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Shield size={28} className="text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة المدير</h1>
          <p className="text-sm text-gray-500">إدارة كاملة للنظام</p>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[['overview', '📊 نظرة عامة'], ['users', '👥 المستخدمون']].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={clsx('px-4 py-2 rounded-xl text-sm font-bold transition-all',
              tab === v ? 'bg-white dark:bg-gray-700 text-purple-700 shadow-sm' : 'text-gray-500')}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="text-4xl animate-spin">⚙️</div></div>
      ) : tab === 'overview' && overview ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'إجمالي المستخدمين', value: overview.total_users, icon: '👥', color: 'from-blue-500 to-indigo-600' },
              { label: 'المستخدمون النشطون', value: overview.active_users, icon: '✅', color: 'from-green-400 to-emerald-600' },
              { label: 'الأطفال', value: overview.children_count, icon: '🧒', color: 'from-purple-500 to-pink-500' },
              { label: 'أولياء الأمور', value: overview.parents_count, icon: '👨‍👩‍👧', color: 'from-orange-400 to-red-500' },
              { label: 'الألعاب المُلعَبة', value: overview.total_games_played, icon: '🎮', color: 'from-yellow-400 to-orange-500' },
              { label: 'إجمالي XP', value: overview.total_xp_awarded?.toLocaleString(), icon: '⚡', color: 'from-teal-400 to-cyan-600' },
              { label: 'المواضيع', value: overview.total_subjects, icon: '📚', color: 'from-indigo-400 to-purple-600' },
              { label: 'إجمالي الألعاب', value: overview.total_games, icon: '🕹️', color: 'from-pink-400 to-rose-500' },
            ].map((s) => (
              <div key={s.label} className={`card bg-gradient-to-br ${s.color} text-white`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-white/80 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === 'users' ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">المستخدم</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">الدور</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">المستوى</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">XP</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">الحالة</th>
                <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((u) => (
                <tr key={u.id} className="text-right">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{u.avatar}</span>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{u.display_name || u.username}</p>
                        <p className="text-xs text-gray-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={clsx('badge text-xs', ROLE_BADGE[u.role])}>{u.role}</span>
                  </td>
                  <td className="py-3 font-bold text-gray-700 dark:text-gray-300">{u.level}</td>
                  <td className="py-3 font-bold text-purple-600">{u.xp}</td>
                  <td className="py-3">
                    <span className={clsx('badge text-xs', u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                      {u.is_active ? '✅ نشط' : '❌ موقوف'}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => toggleUser(u.id, u.is_active)}
                      className="text-gray-400 hover:text-purple-600 transition-colors">
                      {u.is_active ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-300" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
