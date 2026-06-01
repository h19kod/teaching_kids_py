import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'
import { UserPlus, LogIn, Trash2, BarChart2 } from 'lucide-react'

export default function ParentPage() {
  const { childLogin } = useAuthStore()
  const [children, setChildren] = useState([])
  const [form, setForm] = useState({ username: '', display_name: '', avatar: '🦁' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const AVATARS = ['🦁', '🐯', '🦊', '🐻', '🦋', '🐸', '🦄', '🐉', '🦅', '🐬']

  const load = () => api.get('/users/children').then(({ data }) => setChildren(data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const addChild = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await api.post('/users/children', form)
      toast.success(`✅ تم إضافة ${form.display_name || form.username}!`)
      setForm({ username: '', display_name: '', avatar: '🦁' })
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed')
    }
    setAdding(false)
  }

  const removeChild = async (childId, name) => {
    if (!confirm(`هل تريد حذف ${name}؟`)) return
    try {
      await api.delete(`/users/children/${childId}`)
      toast.success('تم الحذف')
      load()
    } catch {
      toast.error('فشل الحذف')
    }
  }

  const loginAsChild = async (childId) => {
    try {
      await childLogin(childId)
      toast.success('تم الدخول كطفل 👶')
      window.location.href = '/dashboard'
    } catch {
      toast.error('فشل الدخول')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">👨‍👩‍👧 لوحة ولي الأمر</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة أطفالك ومتابعة تقدمهم</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <UserPlus size={16} /> إضافة طفل
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">➕ إضافة طفل جديد</h3>
          <form onSubmit={addChild} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">اسم المستخدم *</label>
                <input className="input-field text-sm" placeholder="child_ahmed" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">الاسم الظاهر</label>
                <input className="input-field text-sm" placeholder="أحمد" value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">الأفاتار</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((av) => (
                  <button key={av} type="button" onClick={() => setForm({ ...form, avatar: av })}
                    className={`text-xl p-1.5 rounded-lg transition-all ${form.avatar === av ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    {av}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={adding} className="btn-primary flex-1 py-2 text-sm">
                {adding ? '...' : 'إضافة'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-2 text-sm">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><div className="text-4xl animate-bounce">👧</div></div>
      ) : children.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          <div className="text-5xl mb-3">👨‍👩‍👧</div>
          <p className="mb-2">لا يوجد أطفال بعد</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2">أضف طفلاً</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <div key={child.id} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{child.avatar}</div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">{child.display_name || child.username}</h3>
                  <p className="text-xs text-gray-400">@{child.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'المستوى', value: child.level, icon: '🏅' },
                  { label: 'XP', value: child.xp, icon: '⚡' },
                  { label: 'عملات', value: child.coins, icon: '🪙' },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 text-center">
                    <div className="text-lg">{s.icon}</div>
                    <div className="font-bold text-sm text-gray-800 dark:text-white">{s.value}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => loginAsChild(child.id)}
                  className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1">
                  <LogIn size={13} /> ادخل كـ{child.display_name || child.username}
                </button>
                <button onClick={() => removeChild(child.id, child.display_name || child.username)}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
