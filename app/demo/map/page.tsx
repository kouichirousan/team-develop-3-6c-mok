'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, Clock } from 'lucide-react'

type Department = '開発部' | 'デザイン部' | '営業部' | '人事部' | '経営企画部'

interface Person {
  id: number
  name: string
  department: Department
  checkedInAt: string
  location: string
}

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<Department | 'all'>('all')

  // オフィスにいる人のモックデータ
  const peopleInOffice: Person[] = [
    { id: 1, name: '田中太郎', department: '開発部', checkedInAt: '09:00', location: '1F-A12' },
    { id: 2, name: '佐藤花子', department: 'デザイン部', checkedInAt: '08:45', location: '1F-B05' },
    { id: 3, name: '鈴木一郎', department: '営業部', checkedInAt: '09:15', location: '2F-C08' },
    { id: 4, name: '高橋美咲', department: 'デザイン部', checkedInAt: '08:30', location: '1F-B06' },
    { id: 5, name: '山田健太', department: '開発部', checkedInAt: '09:30', location: '1F-A15' },
    { id: 6, name: '伊藤真理', department: '人事部', checkedInAt: '09:00', location: '2F-D02' },
    { id: 7, name: '渡辺誠', department: '開発部', checkedInAt: '10:00', location: '1F-A18' },
    { id: 8, name: '中村由美', department: '営業部', checkedInAt: '08:50', location: '2F-C12' },
    { id: 9, name: '小林大輔', department: '経営企画部', checkedInAt: '09:20', location: '3F-E01' },
    { id: 10, name: '加藤愛', department: 'デザイン部', checkedInAt: '09:45', location: '1F-B08' },
    { id: 11, name: '吉田拓也', department: '開発部', checkedInAt: '08:40', location: '1F-A20' },
    { id: 12, name: '松本さくら', department: '人事部', checkedInAt: '09:10', location: '2F-D05' },
  ]

  // フィルタリング
  const filteredPeople = peopleInOffice.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.department.includes(searchQuery) ||
                         person.location.includes(searchQuery)
    const matchesDepartment = filterDepartment === 'all' || person.department === filterDepartment
    
    return matchesSearch && matchesDepartment
  })

  // 部署ごとの人数
  const departmentCounts = peopleInOffice.reduce((acc, person) => {
    acc[person.department] = (acc[person.department] || 0) + 1
    return acc
  }, {} as Record<Department, number>)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold mb-2">オフィスマップ</h1>
        <p className="text-gray-600">誰がオフィスにいるか確認</p>
      </motion.div>

      {/* 統計情報 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-6 bg-gradient-to-br from-ocean-medium to-ocean-deep text-white rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]">
          <p className="text-sm opacity-90 mb-1">出社中</p>
          <p className="text-5xl font-bold">{peopleInOffice.length}</p>
          <p className="text-sm opacity-90 mt-1">人</p>
        </div>
      </motion.div>

      {/* 検索とフィルター */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Filter className="text-ocean-medium" size={28} />
          <h2 className="text-xl font-bold">検索・絞り込み</h2>
        </div>

        <div className="space-y-4">
          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="名前、部署、座席番号で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
          </div>

          {/* フィルター */}
          <div>
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">部署</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value as Department | 'all')}
                className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
              >
                <option value="all">すべて</option>
                <option value="開発部">開発部</option>
                <option value="デザイン部">デザイン部</option>
                <option value="営業部">営業部</option>
                <option value="人事部">人事部</option>
                <option value="経営企画部">経営企画部</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 部署別サマリー */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-ocean-medium" size={28} />
          <h2 className="text-xl font-bold">部署別出社状況</h2>
        </div>

        <div className="grid md:grid-cols-5 gap-3">
          {(['開発部', 'デザイン部', '営業部', '人事部', '経営企画部'] as Department[]).map((dept) => (
            <div
              key={dept}
              className="p-4 bg-ocean-surface/30 rounded-xl border-2 border-ocean-light text-center"
            >
              <p className="text-sm text-gray-600 mb-1">{dept}</p>
              <p className="text-3xl font-bold text-ocean-deep">{departmentCounts[dept] || 0}</p>
              <p className="text-xs text-gray-600 mt-1">人</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 出社中の人リスト */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-ocean-medium" size={32} />
            <h2 className="text-2xl font-bold">出社中のメンバー</h2>
          </div>
          <span className="text-lg font-semibold text-ocean-deep">
            {filteredPeople.length}人
          </span>
        </div>

        {filteredPeople.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">該当するメンバーが見つかりません</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeople.map((person) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-br from-ocean-surface/50 to-white rounded-xl border-4 border-ocean-light hover:border-ocean-medium transition-all shadow-[2px_2px_0px_0px_rgba(0,61,92,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-ocean-medium to-ocean-deep rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-ocean-light">
                      {person.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.department}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={14} />
                      <span>{person.checkedInAt}</span>
                    </div>
                    <div className="font-semibold text-ocean-deep">
                      📍 {person.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
