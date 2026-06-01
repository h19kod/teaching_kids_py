import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'
import clsx from 'clsx'
import { ShoppingCart, Package, Star } from 'lucide-react'

const RARITY_BADGE = {
  common: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  uncommon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  rare: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  epic: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
}

export default function RewardsPage() {
  const { user, refreshUser } = useAuthStore()
  const [rewards, setRewards] = useState([])
  const [inventory, setInventory] = useState([])
  const [tab, setTab] = useState('shop')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [r, inv] = await Promise.all([api.get('/rewards/'), api.get('/rewards/inventory')])
    setRewards(r.data)
    setInventory(inv.data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const buy = async (rewardId) => {
    try {
      const { data } = await api.post('/rewards/buy', { reward_id: rewardId })
      toast.success(`✅ ${data.message}`)
      await refreshUser()
      load()
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Purchase failed')
    }
  }

  const equip = async (inventoryId) => {
    try {
      await api.post(`/rewards/inventory/${inventoryId}/equip`)
      toast.success('✨ تم التجهيز!')
      load()
    } catch {}
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🛍 المتجر</h1>
          <p className="text-sm text-gray-500 mt-1">اصرف مكافآتك على مقتنيات رائعة!</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="badge-coins">🪙 {user?.coins || 0}</span>
          <span className="badge bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300">💎 {user?.gems || 0}</span>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[['shop', '🛍 المتجر'], ['inventory', '🎒 مقتنياتي']].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={clsx('px-4 py-2 rounded-xl text-sm font-bold transition-all',
              tab === v ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm'
                       : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="text-4xl animate-bounce">🛍</div></div>
      ) : tab === 'shop' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((r) => (
            <div key={r.id} className="card-hover text-center group">
              <div className="text-5xl mb-3 group-hover:animate-bounce">{r.icon}</div>
              <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{r.name_ar || r.name}</h3>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{r.description_ar || r.description}</p>
              <span className={clsx('badge text-xs mb-3 inline-block', RARITY_BADGE[r.rarity] || RARITY_BADGE.common)}>
                {r.rarity}
              </span>
              <div className="mt-1">
                {r.owned ? (
                  <span className="w-full inline-block py-2 text-sm text-green-600 font-bold bg-green-50 dark:bg-green-900/20 rounded-xl">
                    ✅ مملوك
                  </span>
                ) : (
                  <button onClick={() => buy(r.id)}
                    className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-1.5">
                    <ShoppingCart size={14} />
                    {r.cost_gems > 0 ? `💎 ${r.cost_gems}` : `🪙 ${r.cost_coins}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {inventory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package size={48} className="mx-auto mb-3 opacity-40" />
              <p>لا توجد مقتنيات بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <div key={item.id} className={clsx('card text-center', item.is_equipped && 'ring-2 ring-purple-500')}>
                  <div className="text-4xl mb-2">{item.reward_icon}</div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-1">{item.reward_name}</h4>
                  <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs mb-3">{item.reward_type}</span>
                  {item.is_equipped ? (
                    <div className="py-2 text-sm text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      ✨ مجهز
                    </div>
                  ) : (
                    <button onClick={() => equip(item.id)} className="btn-secondary w-full py-2 text-sm">
                      ارتدِ
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
