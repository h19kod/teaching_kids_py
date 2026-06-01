import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'
import { CheckCircle2, Gift, Lock } from 'lucide-react'
import clsx from 'clsx'

export default function MissionsPage() {
  const { refreshUser } = useAuthStore()
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('daily')

  const load = () => api.get('/missions/').then(({ data }) => setMissions(data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const claim = async (missionId) => {
    try {
      const { data } = await api.post(`/missions/${missionId}/claim`)
      toast.success(`🎁 ${data.message || 'Claimed!'} +${data.xp_earned} XP`)
      await refreshUser()
      load()
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed')
    }
  }

  const filtered = missions.filter((m) => m.mission_type === tab)

  const MissionCard = ({ m }) => {
    const pct = Math.min(100, (m.current_count / m.target_count) * 100)
    return (
      <div className={clsx('card', m.claimed && 'opacity-60')}>
        <div className="flex items-start gap-3">
          <div className="text-3xl">{m.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{m.name_ar || m.name}</h4>
              {m.claimed && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{m.description_ar || m.description}</p>
            <div className="xp-bar h-2 mb-1.5">
              <div className="xp-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{m.current_count}/{m.target_count}</span>
              <div className="flex items-center gap-1.5">
                <span className="badge-xp text-xs">+{m.xp_reward}</span>
                <span className="badge-coins text-xs">+{m.coin_reward}</span>
              </div>
            </div>
          </div>
        </div>
        {m.completed && !m.claimed && (
          <button
            onClick={() => claim(m.id)}
            className="btn-primary w-full mt-3 py-2 text-sm flex items-center justify-center gap-1.5"
          >
            <Gift size={15} /> استلم المكافأة
          </button>
        )}
        {!m.completed && (
          <div className="mt-3 w-full py-2 text-sm text-gray-400 dark:text-gray-500 text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            جاري التقدم...
          </div>
        )}
        {m.claimed && (
          <div className="mt-3 w-full py-2 text-sm text-green-600 text-center bg-green-50 dark:bg-green-900/20 rounded-xl font-semibold">
            ✅ تم الاستلام
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🎯 المهمات</h1>
        <p className="text-sm text-gray-500 mt-1">أكمل المهمات واجمع المكافآت!</p>
      </div>

      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[['daily', '📅 يومية'], ['weekly', '🗓 أسبوعية']].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-bold transition-all',
              tab === v
                ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="text-4xl animate-bounce">🎯</div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">😅</div>
          <p>لا توجد مهمات حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((m) => <MissionCard key={m.id} m={m} />)}
        </div>
      )}
    </div>
  )
}
