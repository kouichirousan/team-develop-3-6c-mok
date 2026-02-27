'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Building, Waves, Building2, Users, MapPin, Clock } from 'lucide-react'

type RegistrationType = 'admin' | 'employee' | null

export default function RegisterPage() {
  const router = useRouter()
  const [registrationType, setRegistrationType] = useState<RegistrationType>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    // オフィス設定用
    officeName: '',
    officeAddress: '',
    totalSeats: '',
    totalEmployees: '',
    floors: '',
    startTime: '09:00',
    endTime: '18:00',
    earlyBirdTime: '08:00',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // モックアップなので、ロールをlocalStorageに保存してからメイン画面に遷移
    setTimeout(() => {
      localStorage.setItem('userRole', registrationType || 'employee')
      router.push('/demo')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // 登録タイプ選択画面
  if (!registrationType) {
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
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{ x: -100, y: Math.random() * 600 }}
            animate={{
              x: [null, typeof window !== 'undefined' ? window.innerWidth + 100 : 1000],
              y: [null, Math.random() * 600],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          >
            🐟
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl relative z-10"
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
              Office Vibe Connector
            </h1>
            <p className="text-ocean-medium">登録タイプを選択してください</p>
          </div>

          {/* 登録タイプ選択 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 管理者として登録 */}
            <motion.button
              onClick={() => setRegistrationType('admin')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.8)] hover:shadow-[12px_12px_0px_0px_rgba(0,61,92,0.8)] transition-all"
            >
              <div className="text-6xl mb-4">👑</div>
              <h2 className="text-2xl font-bold text-ocean-deep mb-3">管理者として登録</h2>
              <p className="text-sm text-gray-600 mb-4">
                新しいオフィスを作成し、全体の設定を管理します
              </p>
              <div className="space-y-2 text-left text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-coral-orange">✓</span>
                  <span>オフィス設定の管理</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-coral-orange">✓</span>
                  <span>経営ダッシュボードへのアクセス</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-coral-orange">✓</span>
                  <span>全機能の利用</span>
                </div>
              </div>
            </motion.button>

            {/* 従業員として登録 */}
            <motion.button
              onClick={() => setRegistrationType('employee')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.8)] hover:shadow-[12px_12px_0px_0px_rgba(0,61,92,0.8)] transition-all"
            >
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-ocean-deep mb-3">従業員として登録</h2>
              <p className="text-sm text-gray-600 mb-4">
                既存のオフィスに参加し、チームと交流します
              </p>
              <div className="space-y-2 text-left text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-ocean-medium">✓</span>
                  <span>チェックイン機能</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ocean-medium">✓</span>
                  <span>バッジ獲得</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ocean-medium">✓</span>
                  <span>ランチマッチング</span>
                </div>
              </div>
            </motion.button>
          </div>

          {/* ログインリンク */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 text-ocean-medium font-semibold hover:text-ocean-deep transition-colors"
            >
              ログインはこちら →
            </button>
          </div>
        </motion.div>
      </div>
    )
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
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          initial={{ x: -100, y: Math.random() * 600 }}
          animate={{
            x: [null, typeof window !== 'undefined' ? window.innerWidth + 100 : 1000],
            y: [null, Math.random() * 600],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        >
          🐟
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* 戻るボタン */}
        <button
          onClick={() => setRegistrationType(null)}
          className="mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-ocean-deep text-ocean-deep font-semibold hover:bg-white transition-colors"
        >
          ← 戻る
        </button>

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
            {registrationType === 'admin' ? '👑 管理者登録' : '👤 従業員登録'}
          </h1>
          <p className="text-ocean-medium">
            {registrationType === 'admin' 
              ? 'オフィス情報と管理者情報を入力してください' 
              : '従業員情報を入力してください'}
          </p>
        </div>

        {/* 新規登録フォーム */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.8)]"
        >
          <form onSubmit={handleRegister} className="space-y-6">
            {/* 管理者の場合：オフィス設定 */}
            {registrationType === 'admin' && (
              <div className="space-y-5 pb-6 border-b-4 border-ocean-light">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="text-ocean-medium" size={24} />
                  <h3 className="text-xl font-bold text-ocean-deep">オフィス情報</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ocean-deep mb-2">
                    オフィス名
                  </label>
                  <input
                    type="text"
                    name="officeName"
                    value={formData.officeName}
                    onChange={handleChange}
                    placeholder="東京本社オフィス"
                    className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ocean-deep mb-2">
                    オフィス住所
                  </label>
                  <input
                    type="text"
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleChange}
                    placeholder="東京都渋谷区〇〇 1-2-3"
                    className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ocean-deep mb-2">
                      総座席数
                    </label>
                    <input
                      type="number"
                      name="totalSeats"
                      value={formData.totalSeats}
                      onChange={handleChange}
                      placeholder="50"
                      className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-deep mb-2">
                      従業員数
                    </label>
                    <input
                      type="number"
                      name="totalEmployees"
                      value={formData.totalEmployees}
                      onChange={handleChange}
                      placeholder="30"
                      className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-deep mb-2">
                      フロア数
                    </label>
                    <input
                      type="number"
                      name="floors"
                      value={formData.floors}
                      onChange={handleChange}
                      placeholder="3"
                      className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ocean-deep mb-2">
                      <Clock size={16} className="inline mr-1" />
                      出社時刻
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-deep mb-2">
                      <Clock size={16} className="inline mr-1" />
                      退社時刻
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-deep mb-2">
                      早起き鳥
                    </label>
                    <input
                      type="time"
                      name="earlyBirdTime"
                      value={formData.earlyBirdTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 共通：ユーザー情報 */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-ocean-medium" size={24} />
                <h3 className="text-xl font-bold text-ocean-deep">
                  {registrationType === 'admin' ? '管理者情報' : 'ユーザー情報'}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ocean-deep mb-2">
                  名前
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-medium" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="山田太郎"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ocean-deep mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-medium" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ocean-deep mb-2">
                  部署
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-medium" size={20} />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="開発部"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ocean-deep mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-medium" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                  />
                </div>
              </div>
            </div>

            {/* 登録ボタン */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 text-white font-bold text-lg rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,61,92,0.5)] transition-all disabled:opacity-50 ${
                registrationType === 'admin'
                  ? 'bg-gradient-to-r from-coral-orange to-coral-pink'
                  : 'bg-gradient-to-r from-ocean-medium to-ocean-deep'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🐠
                  </motion.div>
                  登録中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {registrationType === 'admin' ? '👑' : '👤'} 登録する
                </span>
              )}
            </motion.button>
          </form>

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 text-ocean-medium font-semibold hover:text-ocean-deep transition-colors"
            >
              ログインはこちら →
            </button>
          </div>
        </motion.div>

        {/* デモモード注意書き */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <div className="inline-block px-4 py-2 bg-accent/90 backdrop-blur-sm rounded-full border-2 border-ocean-deep">
            <span className="text-sm font-semibold">🎮 モックアップモード</span>
          </div>
          <p className="text-sm text-ocean-medium mt-2">
            任意の情報で登録できます
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
