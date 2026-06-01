import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'
import { Save, Moon, Sun, Globe, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const AVATARS = ['🦁', '🐯', '🦊', '🐻', '🦋', '🐸', '🦄', '🐉', '🦅', '🐬', '🦕', '🤖', '👽', '🧙', '⭐']

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, updateUser, refreshUser } = useAuthStore()
  const [form, setForm] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '🦁',
    dark_mode: user?.dark_mode || false,
    preferred_language: user?.preferred_language || 'ar',
    sound_enabled: user?.sound_enabled !== false,
  })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const { data } = await api.put('/users/me', form)
      updateUser(data)
      toast.success('✅ تم حفظ الإعدادات')
      if (form.dark_mode) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      i18n.changeLanguage(form.preferred_language)
      document.documentElement.lang = form.preferred_language
      document.documentElement.dir = form.preferred_language === 'ar' ? 'rtl' : 'ltr'
    } catch {
      toast.error('فشل الحفظ')
    }
    setSaving(false)
  }

  const downloadCert = () => {
    window.open('/api/certificates/me', '_blank')
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">👤 الملف الشخصي</h1>
        <p className="text-sm text-gray-500 mt-1">تخصيص حسابك وإعداداتك</p>
      </div>

      <div className="card bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-center">
        <div className="text-6xl mb-2">{form.avatar}</div>
        <h2 className="text-xl font-bold">{user?.display_name || user?.username}</h2>
        <p className="text-white/70 text-sm">@{user?.username}</p>
        <div className="flex justify-center gap-3 mt-3">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Lv. {user?.level}</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">⚡ {user?.xp} XP</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {user?.role === 'admin' ? '👑' : user?.role === 'parent' ? '👨‍👩‍👧' : '🧒'} {user?.role}
          </span>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-gray-800 dark:text-white">✏️ تعديل المعلومات</h3>
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">الاسم الظاهر</label>
          <input className="input-field" value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5">نبذة عنك</label>
          <textarea className="input-field h-20 resize-none" value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="أكتب شيئاً عنك..." />
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-bold text-gray-800 dark:text-white">🦁 الأفاتار</h3>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map((av) => (
            <button key={av} onClick={() => setForm({ ...form, avatar: av })}
              className={`text-2xl p-2 rounded-xl transition-all ${form.avatar === av ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {av}
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-gray-800 dark:text-white">⚙️ الإعدادات</h3>
        {[
          {
            icon: form.dark_mode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-yellow-500" />,
            label: t('dark_mode'),
            control: (
              <button onClick={() => setForm({ ...form, dark_mode: !form.dark_mode })}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.dark_mode ? 'bg-purple-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.dark_mode ? 'left-6' : 'left-0.5'}`} />
              </button>
            )
          },
          {
            icon: <Globe size={18} className="text-blue-500" />,
            label: t('language'),
            control: (
              <select value={form.preferred_language} onChange={(e) => setForm({ ...form, preferred_language: e.target.value })}
                className="text-sm bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1 border-0 focus:outline-none">
                <option value="ar">عربي</option>
                <option value="en">English</option>
              </select>
            )
          },
          {
            icon: <span className="text-lg">🔊</span>,
            label: 'الأصوات',
            control: (
              <button onClick={() => setForm({ ...form, sound_enabled: !form.sound_enabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.sound_enabled ? 'bg-purple-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.sound_enabled ? 'left-6' : 'left-0.5'}`} />
              </button>
            )
          }
        ].map(({ icon, label, control }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {icon} {label}
            </div>
            {control}
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2">
        {saving ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
        حفظ التغييرات
      </button>

      <button onClick={downloadCert}
        className="btn-secondary w-full py-3 flex items-center justify-center gap-2 text-sm">
        <Download size={16} /> تحميل شهادة الإنجاز (PDF)
      </button>
    </div>
  )
}
