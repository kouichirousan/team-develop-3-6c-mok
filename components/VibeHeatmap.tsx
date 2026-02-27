'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface VibeHeatmapProps {
  checkedInCount: number
  totalCapacity?: number
}

export default function VibeHeatmap({ checkedInCount, totalCapacity = 50 }: VibeHeatmapProps) {
  const percentage = (checkedInCount / totalCapacity) * 100
  
  const getVibeColor = () => {
    if (percentage >= 70) return 'bg-vibe-hot'
    if (percentage >= 40) return 'bg-vibe-warm'
    return 'bg-vibe-cool'
  }
  
  const getVibeText = () => {
    if (percentage >= 70) return '🔥 オフィスが熱い！'
    if (percentage >= 40) return '☀️ いい感じ'
    return '❄️ 静かな一日'
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative p-8 rounded-3xl border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        ${getVibeColor()}
        overflow-hidden
      `}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-white/20"
      />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <Flame size={64} className="text-white" />
        <h2 className="text-4xl font-bold text-white">{getVibeText()}</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold text-white">{checkedInCount}</span>
          <span className="text-2xl text-white/80">/ {totalCapacity}</span>
        </div>
        <p className="text-xl text-white/90">人が出社中</p>
      </div>
    </motion.div>
  )
}
