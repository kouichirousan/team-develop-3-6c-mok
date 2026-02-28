'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CheckInButton from '@/components/CheckInButton'
import OceanVibeHeatmap from '@/components/OceanVibeHeatmap'
import BadgeCard from '@/components/BadgeCard'
import { isEarlyBird, calculatePoints } from '@/lib/utils'
import { mockUserBadges, mockUsers, findMatchingUsers } from '@/lib/mock-data'
import type { BadgeType } from '@/types'
import { Sparkles, Award, Clock, Zap } from 'lucide-react'

export default function DemoPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkedInCount, setCheckedInCount] = useState(12)
  const [currentUserPoints, setCurrentUserPoints] = useState(450)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false)
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeType | null>(null)
  const [displayedBadges, setDisplayedBadges] = useState<BadgeType[]>(['early_bird_bronze'])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [simulationLog, setSimulationLog] = useState<string[]>([])
  
  const currentUserId = 'user-1'
  const currentUser = mockUsers.find(u => u.id === currentUserId)!
  const userBadges = mockUserBadges[currentUserId] || []

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const addLog = (message: string) => {
    setSimulationLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)])
  }

  const handleCheckIn = async () => {
    const now = currentTime
    const earlyBird = isEarlyBird(now)
    const points = calculatePoints(earlyBird)

    if (!isCheckedIn) {
      // Check-in
      setIsCheckedIn(true)
      setCheckedInCount(prev => prev + 1)
      setCurrentUserPoints(prev => prev + points)
      
      addLog(`✅ チェックイン完了！`)
      
      if (earlyBird) {
        addLog('🌅 早起き鳥ボーナス！')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        
        // Simulate badge unlock
        if (!userBadges.includes('early_bird_silver')) {
          setTimeout(() => {
            setUnlockedBadge('early_bird_silver')
            setShowBadgeUnlock(true)
            addLog('🏆 新しいバッジ獲得: 早起き鳥 (Silver)')
            setTimeout(() => setShowBadgeUnlock(false), 4000)
          }, 2000)
        }
      }
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
    } else {
      // Check-out
      setIsCheckedIn(false)
      setCheckedInCount(prev => prev - 1)
      addLog('👋 チェックアウト完了！お疲れ様でした')
    }
  }

  const handleBadgeToggle = (badgeType: BadgeType) => {
    if (!userBadges.includes(badgeType)) return
    
    setDisplayedBadges(prev => {
      if (prev.includes(badgeType)) {
        addLog(`📌 バッジを非表示: ${badgeType}`)
        return prev.filter(b => b !== badgeType)
      } else if (prev.length < 3) {
        addLog(`📌 バッジを表示: ${badgeType}`)
        return [...prev, badgeType]
      }
      return prev
    })
  }

  const simulateEarlyMorning = () => {
    const earlyTime = new Date()
    earlyTime.setHours(7, 30, 0)
    setCurrentTime(earlyTime)
    addLog('⏰ 時刻を7:30に変更（早朝シミュレーション）')
  }

  const simulateAfternoon = () => {
    const afternoonTime = new Date()
    afternoonTime.setHours(14, 0, 0)
    setCurrentTime(afternoonTime)
    addLog('⏰ 時刻を14:00に変更（午後シミュレーション）')
  }

  const simulateCrowdedOffice = () => {
    setCheckedInCount(42)
    addLog('👥 オフィスが混雑状態に（42人出社中）')
  }

  const simulateQuietOffice = () => {
    setCheckedInCount(8)
    addLog('🤫 オフィスが静かな状態に（8人出社中）')
  }

  return (
    <main className="min-h-screen p-8">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  opacity: 1,
                  rotate: 0
                }}
                animate={{ 
                  y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 20,
                  opacity: 0,
                  rotate: 720
                }}
                transition={{ duration: 3, delay: Math.random() * 0.5 }}
                className="absolute text-4xl"
              >
                {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Badge Unlock Modal */}
      <AnimatePresence>
        {showBadgeUnlock && unlockedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-white p-8 rounded-3xl border-8 border-accent shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="text-8xl"
                >
                  🏆
                </motion.div>
                <h2 className="text-4xl font-bold">称号獲得！</h2>
                <p className="text-2xl">早起き鳥 (Silver)</p>
                <p className="text-gray-600">7日連続8時前チェックイン達成！</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">ホーム</h1>
              <p className="text-gray-600">今日のオフィスの様子</p>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <Clock className="text-primary" />
              <span className="font-mono font-bold">{currentTime.toLocaleTimeString()}</span>
              <span className={`px-3 py-1 rounded-full border-2 border-black ${isEarlyBird(currentTime) ? 'bg-accent' : 'bg-gray-300'}`}>
                {isEarlyBird(currentTime) ? '🌅 早朝' : '⏰ 通常'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Simulation Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-accent" size={32} />
            <h2 className="text-2xl font-bold">シミュレーションコントロール</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={simulateEarlyMorning}
              className="px-4 py-3 bg-gradient-to-r from-accent to-sand hover:from-sand hover:to-accent rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)] font-bold transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              🌅 早朝モード
            </button>
            <button
              onClick={simulateAfternoon}
              className="px-4 py-3 bg-gradient-to-br from-ocean-light to-ocean-medium text-white hover:from-ocean-medium hover:to-ocean-deep rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)] font-bold transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              ☀️ 午後モード
            </button>
            <button
              onClick={simulateCrowdedOffice}
              className="px-4 py-3 bg-gradient-to-br from-coral-pink to-coral-orange text-white hover:from-coral-orange hover:to-coral-pink rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)] font-bold transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              🔥 混雑状態
            </button>
            <button
              onClick={simulateQuietOffice}
              className="px-4 py-3 bg-gradient-to-br from-ocean-surface to-ocean-light hover:from-ocean-light hover:to-ocean-surface rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)] font-bold transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              ❄️ 静かな状態
            </button>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-gradient-to-br from-ocean-medium to-ocean-deep rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.8)] text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold">{currentUser.name}</h3>
              <p className="text-xl opacity-90">{currentUser.department} • {currentUser.role}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">
                チェックイン: {currentUser.checkin_count}回 | 早起き: {currentUser.early_bird_points}回
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ocean Vibe Heatmap */}
        <OceanVibeHeatmap checkedInCount={checkedInCount} totalCapacity={50} />

        {/* Check-in Button */}
        <div className="flex justify-center py-8">
          <CheckInButton onCheckIn={handleCheckIn} isCheckedIn={isCheckedIn} />
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-primary" size={32} />
              <h2 className="text-2xl font-bold">アクティビティログ</h2>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {simulationLog.length === 0 ? (
                <p className="text-gray-400 text-center py-8">アクティビティはまだありません</p>
              ) : (
                simulationLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 bg-gray-50 rounded-lg text-sm font-mono border-2 border-gray-200"
                  >
                    {log}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
