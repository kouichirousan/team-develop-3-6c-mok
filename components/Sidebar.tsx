'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Map, 
  Trophy, 
  Settings, 
  Menu, 
  X,
  Utensils,
  BarChart3,
  LogOut,
  Building2,
  Calculator
} from 'lucide-react'

const employeeMenuItems = [
  { icon: Home, label: 'ホーム', href: '/demo' },
  { icon: Map, label: 'オフィスマップ', href: '/demo/map' },
  { icon: Trophy, label: 'バッジ', href: '/demo/badges' },
  { icon: Utensils, label: 'ランチ', href: '/demo/lunch' },
  { icon: Settings, label: '設定', href: '/demo/settings' },
]

const adminMenuItems = [
  { icon: Home, label: 'ホーム', href: '/demo' },
  { icon: Map, label: 'オフィスマップ', href: '/demo/map' },
  { icon: Trophy, label: 'バッジ', href: '/demo/badges' },
  { icon: Utensils, label: 'ランチ', href: '/demo/lunch' },
  { icon: BarChart3, label: '経営ダッシュボード', href: '/demo/executive' },
  { icon: Building2, label: 'オフィス設定', href: '/demo/office-settings' },
  { icon: Calculator, label: 'コストシミュレーション', href: '/demo/cost-simulation' },
  { icon: Settings, label: '設定', href: '/demo/settings' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // ロールを取得
    const role = localStorage.getItem('userRole') as 'admin' | 'employee'
    setUserRole(role || 'employee')
  }, [])

  const menuItems = userRole === 'admin' ? adminMenuItems : employeeMenuItems

  const handleLogout = () => {
    // ログアウト時にロール情報をクリア
    localStorage.removeItem('userRole')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 bg-gradient-to-br from-ocean-medium to-ocean-deep rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]"
      >
        {isOpen ? <X className="text-white" /> : <Menu className="text-white" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`
          fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-white to-ocean-surface/20 border-r-4 border-ocean-deep
          shadow-[8px_0px_0px_0px_rgba(0,61,92,0.3)]
          z-40 overflow-y-auto backdrop-blur-sm
          ${isOpen ? 'block' : 'hidden md:block'}
        `}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">彦田ブルー（仮名前）</h1>
            <p className="text-sm text-gray-600">Office Vibe</p>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-gradient-to-br from-ocean-medium to-ocean-deep rounded-xl border-4 border-ocean-deep shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-ocean-deep text-xl font-bold border-2 border-ocean-light">
                田
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold drop-shadow">田中太郎</h3>
                  {userRole === 'admin' && (
                    <span className="text-xs">👑</span>
                  )}
                </div>
                <p className="text-sm opacity-90">
                  {userRole === 'admin' ? '管理者' : '開発部'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-white text-sm">
              <span className="flex items-center gap-1">
                <Trophy size={14} />
                5 badges
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    border-4 border-ocean-deep transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-ocean-light to-ocean-medium text-white shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)]' 
                      : 'bg-white/80 hover:bg-ocean-surface hover:shadow-[2px_2px_0px_0px_rgba(0,61,92,0.2)]'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-4 border-ocean-deep space-y-3">
            {/* ログアウトボタン */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-4 border-ocean-deep bg-gradient-to-r from-coral-pink to-coral-orange text-white hover:from-coral-orange hover:to-coral-pink transition-all shadow-[2px_2px_0px_0px_rgba(0,61,92,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)]"
            >
              <LogOut size={20} />
              <span className="font-semibold">ログアウト</span>
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              v1.0.0 - Demo Mode
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
