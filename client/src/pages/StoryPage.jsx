import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'
import clsx from 'clsx'
import { BookOpen, Lock, CheckCircle, ChevronRight } from 'lucide-react'

export default function StoryPage() {
  const { user, refreshUser } = useAuthStore()
  const [chapters, setChapters] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  const load = () => api.get('/story/chapters').then(({ data }) => setChapters(data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const complete = async (chapterId) => {
    setCompleting(true)
    try {
      const { data } = await api.post('/story/complete', { chapter_id: chapterId })
      toast.success(`📖 فصل مكتمل! +${data.xp_earned} XP`)
      await refreshUser()
      load()
      setSelected(null)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error')
    }
    setCompleting(false)
  }

  const subjects = [...new Set(chapters.map(c => c.subject_id))]

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-5xl animate-bounce">📖</div>
    </div>
  )

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <button onClick={() => setSelected(null)} className="text-sm text-purple-600 hover:underline flex items-center gap-1">
          ← رجوع للقصص
        </button>
        <div className="card space-y-5">
          <div className="text-center">
            <div className="text-6xl mb-3">{selected.illustration}</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{selected.title_ar || selected.title}</h2>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-base bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5">
            {(selected.content_ar || selected.content).split('\n').map((para, i) => (
              <p key={i} className="mb-3">{para}</p>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>🎁 +{selected.xp_reward} XP عند الإكمال</span>
          </div>
          {!selected.completed ? (
            <button
              onClick={() => complete(selected.id)}
              disabled={completing}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {completing ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={18} />}
              اكتمل القراءة
            </button>
          ) : (
            <div className="text-center py-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-700 dark:text-green-300 font-bold">
              ✅ تم قراءة هذا الفصل
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📖 القصة التعليمية</h1>
        <p className="text-sm text-gray-500 mt-1">اقرأ الفصول واكسب نقاط الخبرة!</p>
      </div>

      {subjects.map((subjectId) => {
        const subjectChapters = chapters.filter(c => c.subject_id === subjectId)
        const completed = subjectChapters.filter(c => c.completed).length
        return (
          <div key={subjectId} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-700 dark:text-gray-200">
                📚 المادة {subjectId}
              </h3>
              <span className="text-xs text-gray-400">{completed}/{subjectChapters.length} مكتمل</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjectChapters.map((ch) => {
                const locked = !ch.unlocked
                return (
                  <button
                    key={ch.id}
                    onClick={() => !locked && setSelected(ch)}
                    disabled={locked}
                    className={clsx(
                      'card-hover text-right flex items-center gap-4',
                      locked && 'opacity-50 cursor-not-allowed grayscale'
                    )}
                  >
                    <div className="text-4xl shrink-0">{ch.illustration}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-gray-800 dark:text-white truncate">{ch.title_ar || ch.title}</span>
                        {ch.completed && <CheckCircle size={14} className="text-green-500 shrink-0" />}
                        {locked && <Lock size={14} className="text-gray-400 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {locked ? (
                          <span>🔒 يتطلب {ch.unlock_xp} XP</span>
                        ) : (
                          <span>⚡ +{ch.xp_reward} XP</span>
                        )}
                      </div>
                    </div>
                    {!locked && <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {chapters.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={56} className="mx-auto mb-4 opacity-30" />
          <p>لا توجد قصص متاحة حالياً</p>
        </div>
      )}
    </div>
  )
}
