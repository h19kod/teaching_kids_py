import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'

// ─── Bubble Video Game ───────────────────────────────────────────────────────
const COLORS = [
  ['from-pink-400 to-rose-500', 'shadow-pink-400/60'],
  ['from-purple-400 to-indigo-500', 'shadow-purple-400/60'],
  ['from-blue-400 to-cyan-500', 'shadow-blue-400/60'],
  ['from-green-400 to-emerald-500', 'shadow-green-400/60'],
  ['from-yellow-400 to-orange-500', 'shadow-yellow-400/60'],
  ['from-teal-400 to-cyan-600', 'shadow-teal-400/60'],
]

function useBubbles(options, active) {
  const [bubbles, setBubbles] = useState([])
  const raf = useRef(null)
  const lastTime = useRef(0)

  useEffect(() => {
    if (!active || !options?.length) { setBubbles([]); return }
    const initial = options.map((opt, i) => ({
      id: i,
      text: opt,
      idx: i,
      x: 10 + Math.random() * 70,
      y: 20 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.03,
      color: COLORS[i % COLORS.length],
      scale: 1,
      popped: false,
      wrong: false,
    }))
    setBubbles(initial)

    const animate = (ts) => {
      if (ts - lastTime.current > 16) {
        lastTime.current = ts
        setBubbles((prev) =>
          prev.map((b) => {
            if (b.popped || b.wrong) return b
            let nx = b.x + b.vx
            let ny = b.y + b.vy
            let nvx = b.vx
            let nvy = b.vy
            if (nx < 4 || nx > 88) nvx = -nvx
            if (ny < 5 || ny > 80) nvy = -nvy
            return { ...b, x: nx, y: ny, vx: nvx, vy: nvy }
          })
        )
      }
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [active, JSON.stringify(options)])

  return [bubbles, setBubbles]
}

export default function GamePlayPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuthStore()

  const [session, setSession] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [result, setResult] = useState(null)
  const [difficulty, setDifficulty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [floatTexts, setFloatTexts] = useState([])
  const [locked, setLocked] = useState(false)
  const startTime = useRef(Date.now())
  const livesRef = useRef(3)
  const answersRef = useRef([])

  const q = session?.questions?.[currentQ]
  const [bubbles, setBubbles] = useBubbles(q?.options, !gameOver && !loading && !!q)

  useEffect(() => {
    api.get(`/adaptive/adjust-difficulty?game_id=${gameId}`)
      .then(({ data }) => setDifficulty(data.suggested_difficulty || 1))
      .catch(() => {})
    api.post('/games/play', { game_id: parseInt(gameId), difficulty })
      .then(({ data }) => { setSession(data); setTimeLeft(data.time_limit) })
      .finally(() => setLoading(false))
  }, [gameId])

  const addFloat = (text, x, y, color) => {
    const id = Date.now() + Math.random()
    setFloatTexts((p) => [...p, { id, text, x, y, color }])
    setTimeout(() => setFloatTexts((p) => p.filter((f) => f.id !== id)), 900)
  }

  const handleFinish = useCallback(async (finalAnswers, finalLives) => {
    if (gameOver || submitting) return
    setGameOver(true)
    setSubmitting(true)
    const correct = finalAnswers.filter((a) => a.correct).length
    const total = session?.questions?.length || 1
    const pct = (correct / total) * 100
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000)
    try {
      const { data } = await api.post('/progress/submit', {
        game_id: parseInt(gameId),
        subject_id: session.questions[0]?.subject_id || 1,
        score: pct,
        max_score: 100,
        difficulty,
        time_spent_seconds: timeSpent,
        correct_answers: correct,
        total_questions: total,
      })
      setResult({ ...data, score: pct, correct, total })
      await refreshUser()
      data.achievements_unlocked?.forEach((a) => toast.success(`🏆 ${a.name}!`, { duration: 4000 }))
      if (data.level_up) toast.success(`🎉 المستوى ${data.new_level}!`, { duration: 5000 })
    } catch {}
    setSubmitting(false)
  }, [gameOver, submitting, session, gameId, difficulty])

  useEffect(() => {
    if (!session || gameOver) return
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t)
          handleFinish(answersRef.current, livesRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [session, gameOver])

  const popBubble = (bubble, e) => {
    if (locked || gameOver) return
    setLocked(true)
    const rect = e.currentTarget.closest('.game-arena').getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    const correct = bubble.idx === q.correct_index

    if (correct) {
      const pts = 10 + combo * 5
      setBubbles((prev) => prev.map((b) => b.id === bubble.id ? { ...b, popped: true } : b))
      setScore((s) => s + pts)
      setCombo((c) => c + 1)
      addFloat(`+${pts}${combo > 1 ? ` 🔥×${combo}` : ''}`, px, py, 'text-green-400')
      const newAnswers = [...answersRef.current, { correct: true }]
      answersRef.current = newAnswers
      setAnswers(newAnswers)
      setTimeout(() => {
        const next = currentQ + 1
        if (next >= session.questions.length) {
          handleFinish(newAnswers, livesRef.current)
        } else {
          setCurrentQ(next)
          setLocked(false)
        }
      }, 500)
    } else {
      setBubbles((prev) => prev.map((b) => b.id === bubble.id ? { ...b, wrong: true } : b))
      const newLives = livesRef.current - 1
      livesRef.current = newLives
      setLives(newLives)
      setCombo(0)
      addFloat('✖ خطأ!', px, py, 'text-red-400')
      const newAnswers = [...answersRef.current, { correct: false }]
      answersRef.current = newAnswers
      setAnswers(newAnswers)
      setTimeout(() => setBubbles((prev) => prev.map((b) => b.id === bubble.id ? { ...b, wrong: false } : b)), 600)
      if (newLives <= 0) {
        setTimeout(() => handleFinish(newAnswers, 0), 700)
      } else {
        setTimeout(() => setLocked(false), 700)
      }
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-screen flex-col gap-4 bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="text-8xl animate-bounce">🎮</div>
      <p className="text-white text-xl font-bold animate-pulse">جاري تحميل اللعبة...</p>
    </div>
  )

  // ── Result Screen ─────────────────────────────────────────────────────────
  if (gameOver && result) {
    const won = result.score >= 50
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-8xl animate-bounce">{won ? '🏆' : '💀'}</div>
          <h2 className="text-4xl font-black text-white">{won ? 'رائع!' : 'انتهت اللعبة'}</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: score, l: 'النتيجة', i: '⭐' },
              { v: `${result.correct}/${result.total}`, l: 'صحيح', i: '✅' },
              { v: `+${result.xp_earned}`, l: 'XP', i: '⚡' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className="text-3xl mb-1">{s.i}</div>
                <div className="text-white font-black text-xl">{s.v}</div>
                <div className="text-white/60 text-xs">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 text-sm justify-center flex-wrap">
            <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full font-bold">🪙 +{result.coins_earned}</span>
            <span className="bg-blue-400/20 text-blue-300 px-3 py-1 rounded-full font-bold">⭐ +{result.stars_earned}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setGameOver(false); setResult(null); setCurrentQ(0); setAnswers([]); answersRef.current = []; setLives(3); livesRef.current = 3; setScore(0); setCombo(0); setLoading(true); startTime.current = Date.now(); api.post('/games/play', { game_id: parseInt(gameId), difficulty }).then(({ data }) => { setSession(data); setTimeLeft(data.time_limit); setLoading(false) }) }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3 rounded-2xl text-base transition-all active:scale-95"
            >🔄 مجدداً</button>
            <button onClick={() => navigate(-1)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl transition-all">
              ← رجوع
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Game Arena ────────────────────────────────────────────────────────────
  const timerPct = session ? (timeLeft / session.time_limit) * 100 : 100
  const timerColor = timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444'
  const totalQ = session?.questions?.length || 1
  const qProgress = ((currentQ) / totalQ) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 flex flex-col select-none overflow-hidden">
      {/* HUD */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur z-20">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`text-2xl transition-all duration-300 ${i < lives ? 'opacity-100 scale-100' : 'opacity-20 scale-75 grayscale'}`}>❤️</span>
          ))}
        </div>
        <div className="text-center">
          <div className="text-white font-black text-xl tabular-nums">{score}</div>
          {combo > 1 && (
            <div className="text-yellow-400 text-xs font-bold animate-pulse">🔥 ×{combo} COMBO</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%`, background: timerColor }} />
          </div>
          <span className="text-white font-mono text-sm font-bold w-8 text-right">{timeLeft}</span>
        </div>
      </div>

      {/* Question */}
      {q && (
        <div className="px-4 pt-4 pb-2 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-4 text-center border border-white/20">
            <div className="text-white/60 text-xs mb-1">سؤال {currentQ + 1} / {totalQ}</div>
            <p className="text-white font-black text-lg leading-snug">{q.question}</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                style={{ width: `${qProgress}%` }} />
            </div>
          </div>
          <p className="text-center text-white/50 text-sm mt-2 animate-pulse">💥 اضغط على الإجابة الصحيحة!</p>
        </div>
      )}

      {/* Arena */}
      <div className="relative flex-1 game-arena overflow-hidden mx-3 mb-3 rounded-3xl border border-white/10"
        style={{ background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f0a1e 100%)' }}>

        {/* Stars background */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{ left: `${(i * 37 + 11) % 95}%`, top: `${(i * 53 + 7) % 90}%` }} />
        ))}

        {/* Floating score texts */}
        {floatTexts.map((f) => (
          <div key={f.id}
            className={`absolute pointer-events-none font-black text-lg z-30 ${f.color}`}
            style={{
              left: `${f.x}%`, top: `${f.y}%`,
              animation: 'floatUp 0.9s ease-out forwards',
              textShadow: '0 0 10px currentColor',
            }}>
            {f.text}
          </div>
        ))}

        {/* Bubbles */}
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={(e) => popBubble(b, e)}
            disabled={b.popped || locked}
            className={`
              w-20 h-20 sm:w-24 sm:h-24 rounded-full font-black text-white text-sm sm:text-base
              bg-gradient-to-br ${b.color[0]} shadow-2xl ${b.color[1]}
              border-4 ${b.wrong ? 'border-red-400' : 'border-white/30'}
              flex items-center justify-center text-center px-2
              cursor-pointer z-10
            `}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: `translate(-50%, -50%) scale(${b.popped ? 0 : b.wrong ? 1.15 : 1})`,
              opacity: b.popped ? 0 : 1,
              transition: b.popped ? 'all 0.25s ease' : b.wrong ? 'all 0.1s ease' : undefined,
              boxShadow: b.wrong ? '0 0 30px rgba(239,68,68,0.8)' : undefined,
              background: b.wrong ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : undefined,
            }}
          >
            <span className="leading-tight break-words w-full text-center px-1">{b.text}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1.2); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
        }
      `}</style>
    </div>
  )
}
