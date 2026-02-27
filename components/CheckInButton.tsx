'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

interface CheckInButtonProps {
  onCheckIn: () => Promise<void>
  isCheckedIn: boolean
}

export default function CheckInButton({ onCheckIn, isCheckedIn }: CheckInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onCheckIn()
      setShowMessage(true)
      
      // Haptic feedback (if supported)
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
      
      setTimeout(() => setShowMessage(false), 2000)
    } catch (error) {
      console.error('Check-in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-4">
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative w-64 h-64 rounded-full font-bold text-2xl
          shadow-[8px_8px_0px_0px_rgba(0,61,92,0.8)]
          border-4 border-ocean-deep
          transition-all duration-200
          ${isCheckedIn 
            ? 'bg-gradient-to-br from-ocean-medium to-ocean-deep hover:from-ocean-light hover:to-ocean-medium' 
            : 'bg-gradient-to-br from-accent to-coral-orange hover:from-coral-orange hover:to-accent'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white
        `}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {isCheckedIn ? (
            <>
              <Moon size={48} className="text-white drop-shadow-lg" />
              <span className="drop-shadow-lg">Check Out</span>
              <span className="text-lg drop-shadow-lg">お疲れ様！🌙</span>
            </>
          ) : (
            <>
              <Sun size={48} className="text-white drop-shadow-lg" />
              <span className="drop-shadow-lg">Check In</span>
              <span className="text-lg drop-shadow-lg">Good Morning! 🌊</span>
            </>
          )}
        </div>
      </motion.button>

      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -bottom-16 bg-ocean-deep text-white px-6 py-3 rounded-lg border-4 border-ocean-light font-bold shadow-lg"
        >
          {isCheckedIn ? 'お疲れ様でした！🌙' : 'Good Morning! 🌊'}
        </motion.div>
      )}
    </div>
  )
}
