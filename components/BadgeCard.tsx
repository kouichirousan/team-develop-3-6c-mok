'use client'

import { motion } from 'framer-motion'
import { Award, Star, Coffee, Shield, Utensils } from 'lucide-react'
import type { BadgeType } from '@/types'

interface BadgeCardProps {
  badgeType: BadgeType
  isEarned: boolean
  isDisplayed?: boolean
  onToggleDisplay?: () => void
}

const badgeConfig = {
  early_bird_bronze: {
    icon: Coffee,
    name: '早起き鳥 (Bronze)',
    color: 'bg-gradient-to-br from-amber-600 to-amber-800',
    description: '3日連続8時前チェックイン'
  },
  early_bird_silver: {
    icon: Coffee,
    name: '早起き鳥 (Silver)',
    color: 'bg-gradient-to-br from-gray-400 to-gray-600',
    description: '7日連続8時前チェックイン'
  },
  early_bird_gold: {
    icon: Coffee,
    name: '早起き鳥 (Gold)',
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    description: '14日連続8時前チェックイン'
  },
  office_guardian: {
    icon: Shield,
    name: 'オフィスの守り人',
    color: 'bg-gradient-to-br from-ocean-medium to-ocean-deep',
    description: '滞在時間100時間突破'
  },
  food_fighter: {
    icon: Utensils,
    name: 'フードファイター',
    color: 'bg-gradient-to-br from-coral-pink to-coral-orange',
    description: '異なる部署の5人とランチ'
  }
}

export default function BadgeCard({ badgeType, isEarned, isDisplayed, onToggleDisplay }: BadgeCardProps) {
  const config = badgeConfig[badgeType]
  const Icon = config.icon

  return (
    <motion.div
      whileHover={isEarned ? { scale: 1.05, rotate: 2 } : {}}
      className={`
        relative p-6 rounded-2xl border-4 border-ocean-deep
        shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]
        ${isEarned ? config.color : 'bg-gradient-to-br from-gray-300 to-gray-400'}
        ${!isEarned && 'opacity-50 grayscale'}
        cursor-pointer transition-all
      `}
      onClick={isEarned ? onToggleDisplay : undefined}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Icon size={48} className="text-white" />
          {isDisplayed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2"
            >
              <Star size={24} className="text-accent fill-accent" />
            </motion.div>
          )}
        </div>
        <h3 className="font-bold text-white text-center">{config.name}</h3>
        <p className="text-sm text-white/90 text-center">{config.description}</p>
      </div>
      
      {!isEarned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
          <span className="text-4xl">🔒</span>
        </div>
      )}
    </motion.div>
  )
}
