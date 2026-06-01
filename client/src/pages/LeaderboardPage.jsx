import { useEffect, useState } from 'react'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'
import clsx from 'clsx'
import { Crown, Medal, Trophy } from 'lucide-react'

const RANK_ICON = (rank) => {
  if (rank === 1) return <Crown size={18} className="text-yellow-500" />
  if (rank === 2) return <Medal size={18} className="text-gray-400" />
  if (rank === 3) return <Medal size={18} className="text-amber-700" />
  return <span className="text-sm font-bold text-gray-400">#{rank}</span>
}

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState('global')
  const [data, setData] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/subjects/').then(({ data }) => setSubjects(data))
  }, [])

  useEffect(() => {
    setLoading(true)
    let url = tab === 'global' ? '/leaderboard/global' : tab === 'weekly' ? '/leaderboard/weekly' : `/leaderboard/subject/${selectedSubject}`
    if (tab === 'subject' && !selectedSubject) { setLoading(false); return }
    api.get(url).then(({ data }) => setData(data)).finally(() => setLoading(false))
  }, [tab, selectedSubject])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🏅 المتصدرون</h1>
        <p className="text-sm text-gray-500 mt-1">تنافس مع أصدقائك!</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[['global', '🌍 عالمي'], ['weekly', '📅 أسبوعي'], ['subject', '📚 حسب المادة']].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={clsx('px-3 py-1.5 rounded-xl text-sm font-bold transition-all',
              tab === v ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300')}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'subject' && (
        <div className="flex gap-2 flex-wrap">
          {subjects.map((s) => (
            <button key={s.id} onClick={() => setSelectedSubject(s.id)}
              className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                selectedSubject === s.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300')}>
              {s.icon} {s.name_ar || s.name}
            </button>
          ))}
        </div>
      )}

      {data.slice(0, 3).length === 3 && (
        <div className="flex items-end justify-center gap-3 py-4">
          {[data[1], data[0], data[2]].map((p, i) => (
            <div key={p.user_id} className={clsx('text-center', i === 1 ? 'order-2' : i === 0 ? 'order-1' : 'order-3')}>
              <div className={clsx('text-4xl mb-1', p.is_current_user && 'ring-4 ring-purple-400 rounded-full')}>{p.avatar}</div>
              <div className={clsx('rounded-t-2xl px-4 py-2 text-white font-bold text-sm',
                i === 1 ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 h-20 flex flex-col justify-end'
                : i === 0 ? 'bg-gradient-to-b from-gray-300 to-gray-500 h-16 flex flex-col justify-end'
                : 'bg-gradient-to-b from-amber-600 to-amber-800 h-14 flex flex-col justify-end')}>
                <div>{RANK_ICON(p.rank)}</div>
                <div className="text-xs truncate max-w-16">{p.display_name || p.username}</div>
                <div className="text-xs opacity-80">⚡{p.xp_gained}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><div className="text-4xl animate-bounce">🏅</div></div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Trophy size={48} className="mx-auto mb-3 opacity-40" />
          <p>لا توجد بيانات بعد. العب ألعاباً لتظهر هنا!</p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100 dark:divide-gray-700">
          {data.map((entry) => (
            <div key={entry.user_id}
              className={clsx('flex items-center gap-3 py-3', entry.is_current_user && 'bg-purple-50 dark:bg-purple-900/20 -mx-5 px-5 rounded-xl')}>
              <div className="w-8 flex justify-center shrink-0">{RANK_ICON(entry.rank)}</div>
              <div className="text-2xl">{entry.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className={clsx('font-bold text-sm truncate', entry.is_current_user ? 'text-purple-700 dark:text-purple-300' : 'text-gray-800 dark:text-white')}>
                  {entry.display_name || entry.username}
                  {entry.is_current_user && ' (أنت)'}
                </p>
                <p className="text-xs text-gray-400">Lv. {entry.level} · {entry.games_played} ألعاب</p>
              </div>
              <div className="text-right shrink-0">
                <span className="badge-xp text-xs block">⚡ {entry.xp_gained}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
