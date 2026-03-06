'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CheckInButton from '@/components/CheckInButton'
import OceanVibeHeatmap from '@/components/OceanVibeHeatmap'
import { isEarlyBird, calculatePoints } from '@/lib/utils'
import { mockUsers } from '@/lib/mock-data'

export default function DemoPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkedInCount, setCheckedInCount] = useState(12)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const handleCheckIn = async () => {
    const now = new Date()
    const earlyBird = isEarlyBird(now)

    if (!isCheckedIn) {
      setIsCheckedIn(true)
      setCheckedInCount(prev => prev + 1)
      
      if (earlyBird) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
    } else {
      setIsCheckedIn(false)
      setCheckedInCount(prev => prev - 1)
    }
  }

  return (
    <main className="px-4 pt-6 pb-4">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                  opacity: 1,
                  rotate: 0
                }}
                animate={{ 
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
                  opacity: 0,
                  rotate: 720
                }}
                transition={{ duration: 3, delay: Math.random() * 0.5 }}
                className="absolute text-2xl"
              >
                {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-2xl font-bold">ホーム</h1>
          <p className="text-sm text-gray-600">今日のオフィスの様子</p>
        </motion.div>

        {/* Check-in Button */}
        <div className="flex justify-center py-4">
          <CheckInButton onCheckIn={handleCheckIn} isCheckedIn={isCheckedIn} />
        </div>

        {/* Ocean Vibe Heatmap */}
        <OceanVibeHeatmap checkedInCount={checkedInCount} totalCapacity={50} />
      </div>
    </main>
  )
}
