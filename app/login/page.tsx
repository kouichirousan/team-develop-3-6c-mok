'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Waves } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent, role: 'admin' | 'employee') => {
    e.preventDefault()
    setIsLoading(true)

    // モックアップなので、ロールをlocalStorageに保存してからメイン画面に遷移
    setTimeout(() => {
      localStorage.setItem('userRole', role)
      router.push('/demo')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景の波アニメーション */}
      <div className="absolute inset-0 z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ocean-light/30 to-transparent"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              clipPath: 'polygon(0 50%, 10% 40%, 20% 50%, 30% 40%, 40% 50%, 50% 40%, 60% 50%, 70% 40%, 80% 50%, 90% 40%, 100% 50%, 100% 100%, 0 100%)',
              bottom: `${i * 40}px`,
            }}
          />
        ))}
      </div>

      {/* 泳ぐ魚の装飾 */}
      {isMounted && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          initial={{ x: -100, y: Math.random() * 600 }}
          animate={{
            x: [null, (typeof window !== 'undefined' ? window.innerWidth : 1200) + 100],
            y: [null, Math.random() * 600],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        >
          🐠
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* ロゴ */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            <Waves size={64} className="text-ocean-medium mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-ocean-deep mb-2">
            彦田ブルー（仮名前）
          </h1>
          <p className="text-ocean-medium">オフィスの海へようこそ 🌊</p>
        </div>

        {/* ログインフォーム */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.8)]"
        >
          <h2 className="text-2xl font-bold text-ocean-deep mb-6">ログイン</h2>

          <div className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-medium" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-medium" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                />
              </div>
            </div>

            {/* ログインボタン（管理者） */}
            <motion.button
              onClick={(e) => handleLogin(e as any, 'admin')}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-coral-orange to-coral-pink text-white font-bold text-lg rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,61,92,0.5)] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🌊
                  </motion.div>
                  ログイン中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  👑 管理者でログイン
                </span>
              )}
            </motion.button>

            {/* ログインボタン（従業員） */}
            <motion.button
              onClick={(e) => handleLogin(e as any, 'employee')}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-ocean-medium to-ocean-deep text-white font-bold text-lg rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,61,92,0.5)] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🌊
                  </motion.div>
                  ログイン中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  👤 従業員でログイン
                </span>
              )}
            </motion.button>
          </div>

          {/* 新規登録リンク */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方は
            </p>
            <button
              onClick={() => router.push('/register')}
              className="mt-2 text-ocean-medium font-semibold hover:text-ocean-deep transition-colors"
            >
              新規登録はこちら →
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
