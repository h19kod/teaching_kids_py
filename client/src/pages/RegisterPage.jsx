import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import { UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuthStore()
  const [form, setForm] = useState({ username: '', email: '', password: '', display_name: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ ...form, role: 'parent' })
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 text-white">
          <div className="text-7xl mb-4 animate-float inline-block">🎓</div>
          <h1 className="text-3xl font-bold">إنشاء حساب جديد</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'username', label: 'اسم المستخدم', type: 'text', placeholder: 'my_username' },
              { key: 'display_name', label: 'الاسم الظاهر', type: 'text', placeholder: 'Ahmed' },
              { key: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'email@example.com' },
              { key: 'password', label: 'كلمة المرور', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input
                  type={type}
                  className="input-field"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key !== 'display_name'}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><UserPlus size={18} /> إنشاء الحساب</>
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            لديك حساب؟{' '}
            <Link to="/login" className="text-purple-600 font-bold hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
