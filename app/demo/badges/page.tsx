'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import BadgeCard from '@/components/BadgeCard'
import { Award, Star, TrendingUp } from 'lucide-react'
import type { BadgeType } from '@/types'
import { mockUserBadges } from '@/lib/mock-data'

export default function BadgesPage() {
  const currentUserId = 'user-1'
  const userBadges = mockUserBadges[currentUserId] || []
  const [displayedBadges, setDisplayedBadges] = useState<BadgeType[]>(['early_bird_bronze'])

  const allBadges: BadgeType[] = [
    'early_bird_bronze',
    'early_bird_silver',
    'early_bird_gold',
    'office_guardian',
    'food_fighter',
  ]

  const handleBadgeToggle = (badgeType: BadgeType) => {
    if (!userBadges.includes(badgeType)) return
    
    setDisplayedBadges(prev => {
      if (prev.includes(badgeType)) {
        return prev.filter(b => b !== badgeType)
      } else if (prev.length < 3) {
        return [...prev, badgeType]
      }
      return prev
    })
  }

  const earnedCount = userBadges.length
  const totalCount = allBadges.length
  const progress = (earnedCount / totalCount) * 100

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-2xl font-bold mb-1">バッジコレクション</h1>
        <p className="text-sm text-gray-600">獲得したバッジを管理しよう</p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-gradient-to-r from-primary to-blue-600 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">コレクション進捗</h2>
            <p className="opacity-90">全{totalCount}種類のバッジ</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{earnedCount}/{totalCount}</div>
            <p className="text-sm opacity-90">{progress.toFixed(0)}% 達成</p>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-4 border-2 border-white">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-accent h-full rounded-full"
          />
        </div>
      </motion.div>

      {/* Display Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Star className="text-accent" size={32} />
          <div>
            <h2 className="text-2xl font-bold">プロフィール表示設定</h2>
            <p className="text-sm text-gray-600">最大3つまでバッジを表示できます（{displayedBadges.length}/3）</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {displayedBadges.map((badge) => (
            <div
              key={badge}
              className="px-4 py-2 bg-accent rounded-lg border-2 border-black flex items-center gap-2"
            >
              <Star size={16} className="fill-black" />
              <span className="font-semibold">{badge}</span>
            </div>
          ))}
          {displayedBadges.length === 0 && (
            <p className="text-gray-400">バッジをクリックして表示設定しましょう</p>
          )}
        </div>
      </motion.div>

      {/* Badge Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-vibe-hot" size={32} />
          <h2 className="text-2xl font-bold">全バッジ</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {allBadges.map((badgeType) => (
            <BadgeCard
              key={badgeType}
              badgeType={badgeType}
              isEarned={userBadges.includes(badgeType)}
              isDisplayed={displayedBadges.includes(badgeType)}
              onToggleDisplay={() => handleBadgeToggle(badgeType)}
            />
          ))}
        </div>
      </motion.div>

      {/* How to Earn */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-primary" size={32} />
          <h2 className="text-2xl font-bold">バッジの獲得方法</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="font-bold mb-2">🌅 早起き鳥シリーズ</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Bronze: 3日連続で8時前にチェックイン</li>
              <li>• Silver: 7日連続で8時前にチェックイン</li>
              <li>• Gold: 14日連続で8時前にチェックイン</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="font-bold mb-2">🛡️ オフィスの守り人</h3>
            <p className="text-sm text-gray-600">累計滞在時間が100時間を突破する</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="font-bold mb-2">🍱 フードファイター</h3>
            <p className="text-sm text-gray-600">異なる部署の5人とランチをする</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
