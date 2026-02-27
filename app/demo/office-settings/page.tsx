'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, Users, MapPin, Clock, Shield, AlertCircle } from 'lucide-react'

export default function OfficeSettingsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ロールチェック
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      // 管理者でない場合はホームにリダイレクト
      router.push('/demo')
    } else {
      setIsAuthorized(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🌊
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* ヘッダー */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-coral-orange" size={40} />
          <h1 className="text-4xl font-bold">オフィス設定</h1>
        </div>
        <p className="text-gray-600">管理者専用ページ - オフィス全体の設定を管理</p>
      </motion.div>

      {/* 管理者専用バッジ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block px-4 py-2 bg-coral-orange/20 backdrop-blur-sm rounded-full border-2 border-coral-orange"
      >
        <span className="text-sm font-semibold text-coral-orange">👑 管理者専用</span>
      </motion.div>

      {/* オフィス基本情報 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">オフィス基本情報</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">
              オフィス名
            </label>
            <input
              type="text"
              defaultValue="東京本社オフィス"
              className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">
              住所
            </label>
            <input
              type="text"
              defaultValue="東京都渋谷区〇〇 1-2-3"
              className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                総座席数
              </label>
              <input
                type="number"
                defaultValue="50"
                className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                フロア数
              </label>
              <input
                type="number"
                defaultValue="3"
                className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 従業員数設定 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">従業員数設定</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">
              総従業員数
            </label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
            <p className="text-sm text-gray-600 mt-2">
              現在登録されている従業員数を設定します
            </p>
          </div>
        </div>
      </motion.div>

      {/* 勤務時間設定 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">勤務時間設定</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                標準出社時刻
              </label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                標準退社時刻
              </label>
              <input
                type="time"
                defaultValue="18:00"
                className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">
              早起き鳥ボーナス時刻（この時刻より前のチェックインでボーナス）
            </label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
          </div>
        </div>
      </motion.div>

      {/* 部署管理 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">部署管理</h2>
        </div>

        <div className="space-y-3">
          {['開発部', 'デザイン部', '営業部', '人事部', '経営企画部'].map((dept, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-ocean-surface/30 rounded-xl border-2 border-ocean-light"
            >
              <span className="font-semibold">{dept}</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-ocean-light text-white rounded-lg hover:bg-ocean-medium transition-colors">
                  編集
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  削除
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-full py-3 border-4 border-dashed border-ocean-light text-ocean-medium font-semibold rounded-xl hover:bg-ocean-surface/20 transition-colors">
            + 新しい部署を追加
          </button>
        </div>
      </motion.div>

      {/* エリア設定 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">エリア・座席設定</h2>
        </div>

        <div className="space-y-3">
          {[
            { name: '窓際VIP席', count: 5, special: true },
            { name: '集中ブース', count: 8, special: true },
            { name: '一般デスク', count: 30, special: false },
            { name: '会議室', count: 7, special: false },
          ].map((area, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                area.special 
                  ? 'bg-accent/20 border-accent' 
                  : 'bg-ocean-surface/30 border-ocean-light'
              }`}
            >
              <div>
                <span className="font-semibold">{area.name}</span>
                {area.special && (
                  <span className="ml-2 text-xs px-2 py-1 bg-accent rounded-full">特権席</span>
                )}
                <p className="text-sm text-gray-600 mt-1">{area.count}席</p>
              </div>
              <button className="px-4 py-2 bg-ocean-light text-white rounded-lg hover:bg-ocean-medium transition-colors">
                編集
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 保存ボタン */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-4"
      >
        <button className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl border-4 border-gray-400 hover:bg-gray-300 transition-colors">
          キャンセル
        </button>
        <button className="px-8 py-4 bg-gradient-to-r from-ocean-medium to-ocean-deep text-white font-bold rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,61,92,0.5)] transition-all">
          変更を保存
        </button>
      </motion.div>
    </div>
  )
}
