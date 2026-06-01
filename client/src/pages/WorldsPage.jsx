import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Lock, ChevronRight } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

const GRADIENTS = {
  english: 'from-blue-500 to-indigo-600',
  math: 'from-yellow-400 to-orange-500',
  science: 'from-green-400 to-emerald-600',
  space: 'from-purple-500 to-pink-600',
}

export default function WorldsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/subjects/').then(({ data }) => setSubjects(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-5xl animate-bounce">🌍</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🌍 العوالم التعليمية</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">اختر عالمك وابدأ مغامرتك!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {subjects.map((subject) => {
          const locked = user?.level < subject.unlock_level
          const gradient = GRADIENTS[subject.world_type] || 'from-purple-500 to-indigo-600'
          return (
            <button
              key={subject.id}
              onClick={() => !locked && navigate(`/worlds/${subject.id}/games`)}
              className={`world-card bg-gradient-to-br ${gradient} text-white text-right w-full
                          ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="absolute inset-0 bg-black/10 rounded-3xl" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{subject.icon}</div>
                  {locked ? (
                    <div className="bg-white/20 rounded-xl p-2">
                      <Lock size={20} />
                    </div>
                  ) : (
                    <div className="bg-white/20 rounded-xl p-2">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{subject.name_ar || subject.name}</h3>
                <p className="text-white/80 text-sm mb-3">{subject.description}</p>
                {locked ? (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                    🔒 يفتح عند المستوى {subject.unlock_level}
                  </span>
                ) : (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                    ✨ العب الآن
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
