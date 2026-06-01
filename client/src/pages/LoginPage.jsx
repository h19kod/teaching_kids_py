import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import { Eye, EyeOff, LogIn } from 'lucide-react'

const DEMO = [
  { label: '👑 Admin', email: 'admin@kids.com', password: 'admin123' },
  { label: '👨‍👩‍👧 Parent', email: 'parent@kids.com', password: 'parent123' },
]

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    }
  }

  const fillDemo = (d) => {
    setEmail(d.email)
    setPassword(d.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 text-white">
          <div className="text-7xl mb-4 animate-float inline-block">🎓</div>
          <h1 className="text-3xl font-bold">{t('appName')}</h1>
          <p className="text-purple-200 mt-1">مغامرة التعلم للأطفال</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            {t('login')}
          </h2>

          <div className="flex gap-2 mb-5">
            {DEMO.map((d) => (
              <button
                key={d.email}
                onClick={() => fillDemo(d)}
                className="flex-1 py-1.5 text-xs rounded-xl border-2 border-purple-200 dark:border-purple-700
                           hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300
                           font-semibold transition-all"
              >
                {d.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                البريد الإلكتروني / اسم المستخدم
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="admin@kids.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base mt-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  {t('login')}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-purple-600 font-bold hover:underline">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
