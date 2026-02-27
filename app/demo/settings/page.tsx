'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Palette, Save } from 'lucide-react'
import type { WorkStyle, HobbyTag } from '@/types'

const workStyles: WorkStyle[] = ['集中モード', '雑談OK', '相談のります']
const hobbyTags: HobbyTag[] = ['サウナ', 'キャンプ', '激辛', '筋トレ', '投資', 'アニメ']

export default function SettingsPage() {
  const [name, setName] = useState('田中太郎')
  const [department, setDepartment] = useState('開発部')
  const [workStyle, setWorkStyle] = useState<WorkStyle>('集中モード')
  const [selectedHobbies, setSelectedHobbies] = useState<HobbyTag[]>(['サウナ', '筋トレ', '投資'])
  const [notifications, setNotifications] = useState({
    checkin: true,
    badge: true,
    lunch: true,
    ranking: false,
  })
  const [saved, setSaved] = useState(false)

  const toggleHobby = (hobby: HobbyTag) => {
    setSelectedHobbies(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold mb-2">設定</h1>
        <p className="text-gray-600">プロフィールと通知設定</p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="text-primary" size={32} />
          <h2 className="text-2xl font-bold">プロフィール設定</h2>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-2">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-4 border-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block font-semibold mb-2">部署</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-4 border-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Work Style */}
          <div>
            <label className="block font-semibold mb-2">ワークスタイル</label>
            <div className="grid grid-cols-3 gap-3">
              {workStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setWorkStyle(style)}
                  className={`
                    px-4 py-3 rounded-xl border-4 border-black font-semibold
                    transition-all
                    ${workStyle === style
                      ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Hobby Tags */}
          <div>
            <label className="block font-semibold mb-2">趣味タグ（複数選択可）</label>
            <div className="grid grid-cols-3 gap-3">
              {hobbyTags.map((hobby) => (
                <button
                  key={hobby}
                  onClick={() => toggleHobby(hobby)}
                  className={`
                    px-4 py-3 rounded-xl border-4 border-black font-semibold
                    transition-all
                    ${selectedHobbies.includes(hobby)
                      ? 'bg-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                >
                  {hobby}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              選択中: {selectedHobbies.length}個
            </p>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-accent" size={32} />
          <h2 className="text-2xl font-bold">通知設定</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'checkin', label: 'チェックインリマインダー', desc: '毎朝9時に通知' },
            { key: 'badge', label: 'バッジ獲得通知', desc: '新しいバッジを獲得したとき' },
            { key: 'lunch', label: 'ランチ招待通知', desc: '誰かからランチに誘われたとき' },
            { key: 'ranking', label: 'ランキング更新通知', desc: '毎週月曜日に順位を通知' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
            >
              <div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({
                  ...prev,
                  [item.key]: !prev[item.key as keyof typeof prev]
                }))}
                className={`
                  w-14 h-8 rounded-full border-4 border-black transition-all
                  ${notifications[item.key as keyof typeof notifications]
                    ? 'bg-primary'
                    : 'bg-gray-300'
                  }
                `}
              >
                <motion.div
                  animate={{
                    x: notifications[item.key as keyof typeof notifications] ? 24 : 0
                  }}
                  className="w-6 h-6 bg-white rounded-full border-2 border-black"
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-vibe-hot" size={32} />
          <h2 className="text-2xl font-bold">プライバシー設定</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="font-semibold mb-2">プロフィール公開範囲</h3>
            <select className="w-full px-4 py-2 rounded-lg border-2 border-black">
              <option>全員に公開</option>
              <option>同じ部署のみ</option>
              <option>非公開</option>
            </select>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="font-semibold mb-2">在席情報の表示</h3>
            <select className="w-full px-4 py-2 rounded-lg border-2 border-black">
              <option>常に表示</option>
              <option>勤務時間のみ</option>
              <option>非表示</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full py-4 rounded-xl border-4 border-black font-bold text-xl
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          transition-all
          ${saved
            ? 'bg-green-500 text-white'
            : 'bg-accent hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
          }
        `}
      >
        <div className="flex items-center justify-center gap-2">
          {saved ? (
            <>
              <span>✓</span>
              <span>保存しました！</span>
            </>
          ) : (
            <>
              <Save size={24} />
              <span>設定を保存</span>
            </>
          )}
        </div>
      </motion.button>
    </div>
  )
}
