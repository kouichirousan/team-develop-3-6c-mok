'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Map,
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
  { icon: Settings, label: '設定', href: '/demo/settings' },
]

const adminMenuItems = [
  { icon: Home, label: 'ホーム', href: '/demo' },
  { icon: Map, label: 'マップ', href: '/demo/map' },
  { icon: BarChart3, label: '経営ダッシュボード', href: '/demo/executive' },
  { icon: Building2, label: 'オフィス設定', href: '/demo/office-settings' },
  { icon: Calculator, label: 'コストシミュレーション', href: '/demo/cost-simulation' },
  { icon: Settings, label: '設定', href: '/demo/settings' },
]

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('userRole') as 'admin' | 'employee'
    setUserRole(role || 'employee')
  }, [])

  // パス変更時にメニューを閉じる
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    setIsOpen(false)
    router.push('/login')
  }

  const isAdmin = userRole === 'admin'
  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-xl border-3 border-ocean-deep shadow-[3px_3px_0px_0px_rgba(0,61,92,0.8)] active:shadow-[1px_1px_0px_0px_rgba(0,61,92,0.8)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        aria-label="メニュー"
      >
        {isOpen ? (
          <X size={22} className="text-ocean-deep" strokeWidth={2.5} />
        ) : (
          <Menu size={22} className="text-ocean-deep" strokeWidth={2.5} />
        )}
      </button>

      {/* オーバーレイ + サイドパネル */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景オーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* サイドメニュー */}
            <motion.nav
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-40 w-[280px] bg-white border-r-4 border-ocean-deep shadow-[4px_0px_20px_rgba(0,0,0,0.15)] flex flex-col"
            >
              {/* ヘッダー */}
              <div className="pt-6 pb-4 px-5 border-b-3 border-ocean-light">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-ocean-medium to-ocean-deep rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-ocean-deep font-bold border-2 border-ocean-light text-sm">
                    田
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-sm">田中太郎</p>
                    <p className="text-xs opacity-80">
                      {isAdmin ? '👑 管理者' : '開発部'}
                    </p>
                  </div>
                </div>
              </div>

              {/* メニューリスト */}
              <div className="flex-1 overflow-y-auto py-3 px-3">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                          isActive
                            ? 'bg-ocean-medium text-white shadow-[2px_2px_0px_0px_rgba(0,61,92,0.5)]'
                            : 'text-ocean-deep hover:bg-ocean-surface/50'
                        }`}
                      >
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* ログアウト */}
              <div className="p-3 border-t-3 border-ocean-light">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-coral-pink to-coral-orange text-white font-semibold border-2 border-ocean-deep text-sm active:opacity-80 transition-all"
                >
                  <LogOut size={18} />
                  <span>ログアウト</span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
