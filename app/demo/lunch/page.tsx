'use client'

import { motion } from 'framer-motion'
import { Send, Check, X, Clock } from 'lucide-react'
import { mockUsers } from '@/lib/mock-data'

export default function LunchPage() {
  const currentUserId = 'user-1'
  const otherUsers = mockUsers.filter(u => u.id !== currentUserId)

  const lunchRequests = [
    { id: 1, from: '佐藤花子', status: 'pending', date: '2024-02-27' },
    { id: 2, from: '高橋美咲', status: 'pending', date: '2024-02-28' },
  ]

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-2xl font-bold mb-1">ランチマッチング</h1>
        <p className="text-sm text-gray-600">社内交流を促進しよう</p>
      </motion.div>

      {/* Progress to Food Fighter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-gradient-to-r from-vibe-hot to-orange-500 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">フードファイター進捗</h2>
            <p className="opacity-90">異なる部署の5人とランチ</p>
          </div>
          <div className="text-5xl">🍱</div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex-1 h-4 rounded-full border-2 border-white ${
                i <= 3 ? 'bg-accent' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <p className="text-right font-bold">3 / 5 達成</p>
      </motion.div>

      {/* Pending Requests */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-accent" size={32} />
          <h2 className="text-2xl font-bold">ランチ招待</h2>
        </div>
        <div className="space-y-3">
          {lunchRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-accent/20 rounded-xl border-2 border-black flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">{request.from}</h3>
                <p className="text-sm text-gray-600">{request.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-green-500 text-white rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Check size={20} />
                </button>
                <button className="p-3 bg-red-500 text-white rounded-lg border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
          {lunchRequests.length === 0 && (
            <p className="text-center text-gray-400 py-8">現在、招待はありません</p>
          )}
        </div>
      </motion.div>

      {/* Send Invitation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Send className="text-primary" size={32} />
          <h2 className="text-2xl font-bold">ランチに誘う</h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {otherUsers.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-black">
                  {user.name[0]}
                </div>
                <div>
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.department}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-accent rounded-lg border-2 border-black font-semibold hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                招待
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
