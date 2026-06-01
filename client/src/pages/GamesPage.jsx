import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Play, Clock, Star } from 'lucide-react'

const DIFF_COLORS = ['', 'bg-green-100 text-green-700', 'bg-blue-100 text-blue-700',
  'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700']

export default function GamesPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/subjects/${subjectId}`),
      api.get(`/subjects/${subjectId}/games`),
    ]).then(([s, g]) => {
      setSubject(s.data)
      setGames(g.data)
    }).finally(() => setLoading(false))
  }, [subjectId])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-5xl animate-bounce">🎮</div>
    </div>
  )

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/worlds')} className="text-sm text-purple-600 hover:underline">
        ← العودة للعوالم
      </button>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{subject?.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {subject?.name_ar || subject?.name}
          </h1>
          <p className="text-sm text-gray-500">{games.length} لعبة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game.id} className="card-hover group">
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl group-hover:animate-bounce">{game.thumbnail}</div>
              <span className={`badge ${DIFF_COLORS[game.min_difficulty] || 'bg-gray-100 text-gray-600'} text-xs`}>
                Lv. {game.min_difficulty}-{game.max_difficulty}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">
              {game.name_ar || game.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{game.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1"><Clock size={12} /> {game.time_limit_seconds}s</span>
              <span>⚡+{game.xp_per_win} XP</span>
              <span>🪙+{game.coin_reward}</span>
            </div>
            <button
              onClick={() => navigate(`/games/${game.id}/play`)}
              className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-1.5"
            >
              <Play size={14} /> العب الآن
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
