'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Map, 
  Trophy, 
  Utensils,
  BarChart3,
  Settings,
  Building2,
  Calculator,
  LogOut,
  Menu,
  X
} from 'lucide-react'

const employeeMenuItems = [
  { icon: Home, label: 'ホーム', href: '/demo' },
  { icon: Map, label: 'マップ', href: '/demo/map' },
  { icon: Trophy, label: 'バッジ', href: '/demo/badges' },
  { icon: Utensils, label: 'ランチ', href: '/demo/lunch' },
  { icon: Settings, label: '設定', href: '/demo/settings' },
]

const adminExtraItems = [
  { icon: BarChart3, label: '経営', href: '/demo/executive' },
  { icon: Building2, label: 'オフィス', href: '/demo/office-settings' },
  { icon: Calculator, label: 'コスト', href: '/demo/cost-simulation' },
]

export default function BottomNav() {
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee')
  const [showMore, setShowMore] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('userRole') as 'admin' | 'employee'
    setUserRole(role || 'employee')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    router.push('/login')
  }

  // 管理者の場合、基本4つ + もっと見る
  const isAdmin = userRole === 'admin'
  const primaryItems = isAdmin 
    ? [
        { icon: Home, label: 'ホーム', href: '/demo' },
        { icon: Map, label: 'マップ', href: '/demo/map' },
        { icon: Trophy, label: 'バッジ', href: '/demo/badges' },
        { icon: Utensils, label: 'ランチ', href: '/demo/lunch' },
      ]
    : employeeMenuItems

  const isMoreActive = isAdmin && [...adminExtraItems, { icon: Settings, label: '設定', href: '/demo/settings' }].some(item => pathname === item.href)

  return (
    <>
      {/* もっと見るパネル (管理者用) */}
      {showMore && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowMore(false)}
          />
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-[72px] left-0 right-0 z-50 bg-white rounded-t-3xl border-t-4 border-x-4 border-ocean-deep shadow-[0_-4px_20px_rgba(0,0,0,0.15)] p-5 pb-3"
          >
            {/* ドラッグハンドル */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            {/* ユーザー情報 */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-ocean-medium to-ocean-deep rounded-xl">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-ocean-deep font-bold border-2 border-ocean-light">
                田
              </div>
              <div className="text-white">
                <p className="font-bold text-sm">田中太郎</p>
                <p className="text-xs opacity-80">
                  {isAdmin ? '👑 管理者' : '開発部'}
                </p>
              </div>
            </div>

            {/* 管理者メニュー */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[...adminExtraItems, { icon: Settings, label: '設定', href: '/demo/settings' }].map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'bg-ocean-medium text-white border-ocean-deep'
                        : 'bg-ocean-surface/30 text-ocean-deep border-ocean-light hover:bg-ocean-surface'
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* ログアウト */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-coral-pink to-coral-orange text-white font-semibold border-2 border-ocean-deep"
            >
              <LogOut size={18} />
              <span className="text-sm">ログアウト</span>
            </button>
          </motion.div>
        </>
      )}

      {/* ボトムナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-4 border-ocean-deep safe-bottom">
        <div className="flex items-center justify-around px-1 pt-2 pb-1">
          {primaryItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all min-w-[60px] ${
                  isActive 
                    ? 'text-ocean-deep' 
                    : 'text-gray-400 hover:text-ocean-medium'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-ocean-surface' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* 管理者の場合: もっと見るボタン */}
          {isAdmin && (
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all min-w-[60px] ${
                showMore || isMoreActive
                  ? 'text-ocean-deep' 
                  : 'text-gray-400 hover:text-ocean-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${showMore || isMoreActive ? 'bg-ocean-surface' : ''}`}>
                {showMore ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={showMore || isMoreActive ? 2.5 : 2} />}
              </div>
              <span className={`text-[10px] ${showMore || isMoreActive ? 'font-bold' : 'font-medium'}`}>
                その他
              </span>
            </button>
          )}

          {/* 従業員の場合: ログアウト用にSidebar不要（設定はメニューに含まれている） */}
        </div>
      </nav>
    </>
  )
}
