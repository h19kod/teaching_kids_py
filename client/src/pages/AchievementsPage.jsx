import { useEffect, useState } from 'react'
import api from '../lib/api'
import clsx from 'clsx'

const RARITY_STYLES = {
  common: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800',
  uncommon: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20',
  rare: 'border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20',
  epic: 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  legendary: 'border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20',
}

const RARITY_LABEL = { common: 'عادي', uncommon: 'غير شائع', rare: 'نادر', epic: 'ملحمي', legendary: 'أسطوري' }

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/achievements/').then(({ data }) => setAchievements(data)).finally(() => setLoading(false))
  }, [])

  const earned = achievements.filter(a => a.earned).length
  const filtered = filter === 'all' ? achievements : filter === 'earned' ? achievements.filter(a => a.earned) : achievements.filter(a => !a.earned)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🏆 الإنجازات</h1>
        <p className="text-sm text-gray-500 mt-1">{earned} / {achievements.length} مكتسب</p>
      </div>

      <div className="card bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">إجمالي الإنجازات</p>
            <p className="text-3xl font-bold">{earned}</p>
          </div>
          <div className="text-5xl">🏆</div>
        </div>
        <div className="mt-3 xp-bar">
          <div className="xp-fill bg-white/50" style={{ width: `${achievements.length ? (earned / achievements.length) * 100 : 0}%` }} />
        </div>
        <p className="text-xs text-white/70 mt-1">{achievements.length - earned} متبقٍ</p>
      </div>

      <div className="flex gap-2">
        {[['all', '🔵 الكل'], ['earned', '✅ مكتسب'], ['locked', '🔒 مقفل']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
              filter === v ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300')}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="text-4xl animate-bounce">🏆</div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((a) => (
            <div key={a.id} className={clsx('rounded-2xl border-2 p-4 transition-all', RARITY_STYLES[a.rarity] || RARITY_STYLES.common, !a.earned && 'opacity-60 grayscale')}>
              <div className="flex items-start gap-3">
                <div className="text-4xl">{a.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{a.name_ar || a.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 dark:bg-gray-700/60 font-medium text-gray-600 dark:text-gray-300">
                      {RARITY_LABEL[a.rarity] || a.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{a.description_ar || a.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="badge-xp text-xs">+{a.xp_reward} XP</span>
                    <span className="badge-coins text-xs">+{a.coin_reward}</span>
                    {a.earned && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        ✅ {a.earned_at ? new Date(a.earned_at).toLocaleDateString('ar') : 'مكتسب'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
