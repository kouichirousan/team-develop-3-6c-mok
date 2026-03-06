'use client'

import { motion } from 'framer-motion'
import { Waves } from 'lucide-react'

interface OceanVibeHeatmapProps {
  checkedInCount: number
  totalCapacity?: number
}

export default function OceanVibeHeatmap({ checkedInCount, totalCapacity = 50 }: OceanVibeHeatmapProps) {
  const percentage = (checkedInCount / totalCapacity) * 100
  
  const getOceanDepth = () => {
    if (percentage >= 70) return { bg: 'from-ocean-deep to-ocean-medium', text: '🌊 オフィスが活気に満ちています！' }
    if (percentage >= 40) return { bg: 'from-ocean-medium to-ocean-light', text: '🐠 いい感じの賑わいです' }
    return { bg: 'from-ocean-light to-ocean-surface', text: '🐟 静かな海のようです' }
  }

  const oceanDepth = getOceanDepth()

  // Generate fish based on checked-in count
  const fishes = Array.from({ length: checkedInCount }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 60 + 20,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    size: Math.random() > 0.7 ? 'text-4xl' : 'text-3xl',
    emoji: ['🐠', '🐟', '🐡', '🦈', '🐙'][Math.floor(Math.random() * 5)],
  }))

  // Generate bubbles
  const bubbles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 2,
  }))

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative p-8 rounded-3xl border-4 border-ocean-deep
        shadow-[6px_6px_0px_0px_rgba(0,61,92,0.8)]
        bg-gradient-to-b ${oceanDepth.bg}
        overflow-hidden min-h-[280px]
      `}
    >
      {/* Wave effect at top */}
      <motion.div
        animate={{
          x: [0, 20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/20 to-transparent"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 90% 60%, 80% 50%, 70% 60%, 60% 50%, 50% 60%, 40% 50%, 30% 60%, 20% 50%, 10% 60%, 0 50%)'
        }}
      />

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ 
            y: -400,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5]
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute w-3 h-3 bg-white/40 rounded-full"
          style={{ left: `${bubble.x}%`, bottom: 0 }}
        />
      ))}

      {/* Swimming fish */}
      {fishes.map((fish) => (
        <motion.div
          key={fish.id}
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, 30, 0, -20, 0],
            y: [0, -15, -5, -20, 0],
          }}
          transition={{
            duration: fish.duration,
            delay: fish.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute ${fish.size}`}
          style={{ 
            left: `${fish.x}%`, 
            top: `${fish.y}%`,
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
        >
          {fish.emoji}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Waves size={48} className="text-white drop-shadow-lg" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white drop-shadow-lg text-center">
          {oceanDepth.text}
        </h2>
        
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white drop-shadow-lg">{checkedInCount}</span>
          <span className="text-2xl text-white/90 drop-shadow-lg">/ {totalCapacity}</span>
        </div>
        
        <div className="flex items-center gap-2 text-lg text-white/90 drop-shadow-lg">
          <span className="text-2xl">🐠</span>
          <p>人が出社中</p>
        </div>

        {/* Ocean floor decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-sand/30 to-transparent">
          <div className="absolute bottom-2 left-0 right-0 flex justify-around text-2xl">
            <span>🪸</span>
            <span>🐚</span>
            <span>⭐</span>
            <span>🪸</span>
            <span>🐚</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
