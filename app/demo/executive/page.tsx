'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Calendar, Filter } from 'lucide-react'

type DataType = 'attendance' | 'spaceLoad' | 'lunch'
type FilterType = 'daily' | 'monthly' | 'weekly' | 'yearly'

// モックデータ生成
const generateMockData = (dataType: DataType, filterType: FilterType) => {
  const getDataCount = () => {
    switch (filterType) {
      case 'daily': return 30 // 30日分
      case 'weekly': return 12 // 12週分
      case 'monthly': return 12 // 12ヶ月分
      case 'yearly': return 5 // 5年分
    }
  }

  const getLabel = (index: number) => {
    switch (filterType) {
      case 'daily': return `${index + 1}日`
      case 'weekly': return `第${index + 1}週`
      case 'monthly': return `${index + 1}月`
      case 'yearly': return `${2020 + index}年`
    }
  }

  const count = getDataCount()
  const data = []

  for (let i = 0; i < count; i++) {
    let value = 0
    switch (dataType) {
      case 'attendance':
        value = 50 + Math.random() * 30 // 50-80%
        break
      case 'spaceLoad':
        value = 40 + Math.random() * 40 // 40-80%
        break
      case 'lunch':
        value = 10 + Math.random() * 20 // 10-30回
        break
    }
    data.push({
      label: getLabel(i),
      value: Math.round(value * 10) / 10
    })
  }

  return data
}

export default function ExecutivePage() {
  const [dataType, setDataType] = useState<DataType>('attendance')
  const [filterType, setFilterType] = useState<FilterType>('daily')

  const chartData = generateMockData(dataType, filterType)
  const maxValue = Math.max(...chartData.map(d => d.value))

  const dataTypeConfig = {
    attendance: {
      label: '出社率',
      unit: '%',
      color: 'from-ocean-medium to-ocean-deep',
      icon: Users,
    },
    spaceLoad: {
      label: '空間負荷率',
      unit: '%',
      color: 'from-coral-orange to-coral-pink',
      icon: BarChart3,
    },
    lunch: {
      label: 'ランチ回数',
      unit: '回',
      color: 'from-green-500 to-green-600',
      icon: TrendingUp,
    },
  }

  const currentConfig = dataTypeConfig[dataType]
  const Icon = currentConfig.icon

  // 統計情報の計算
  const average = (chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)
  const max = Math.max(...chartData.map(d => d.value)).toFixed(1)
  const min = Math.min(...chartData.map(d => d.value)).toFixed(1)

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-2xl font-bold mb-1">経営ダッシュボード</h1>
        <p className="text-sm text-gray-600">オフィス活用状況の分析</p>
      </motion.div>

      {/* データタイプ選択 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <h2 className="text-xl font-bold mb-4">表示データ選択</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setDataType('attendance')}
            className={`p-3 rounded-xl border-4 font-bold transition-all text-sm ${
              dataType === 'attendance'
                ? 'bg-gradient-to-r from-ocean-medium to-ocean-deep text-white border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]'
                : 'bg-white text-ocean-deep border-ocean-light hover:border-ocean-medium'
            }`}
          >
            <Users className="mx-auto mb-2" size={32} />
            <span className="block">出社率</span>
          </button>

          <button
            onClick={() => setDataType('spaceLoad')}
            className={`p-3 rounded-xl border-4 font-bold transition-all text-sm ${
              dataType === 'spaceLoad'
                ? 'bg-gradient-to-r from-coral-orange to-coral-pink text-white border-coral-orange shadow-[4px_4px_0px_0px_rgba(251,146,60,0.5)]'
                : 'bg-white text-coral-orange border-coral-orange/30 hover:border-coral-orange'
            }`}
          >
            <BarChart3 className="mx-auto mb-2" size={32} />
            <span className="block">空間負荷率</span>
          </button>

          <button
            onClick={() => setDataType('lunch')}
            className={`p-3 rounded-xl border-4 font-bold transition-all text-sm ${
              dataType === 'lunch'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-[4px_4px_0px_0px_rgba(34,197,94,0.5)]'
                : 'bg-white text-green-600 border-green-200 hover:border-green-400'
            }`}
          >
            <TrendingUp className="mx-auto mb-2" size={32} />
            <span className="block">ランチ回数</span>
          </button>
        </div>
      </motion.div>

      {/* 絞り込み機能 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Filter className="text-ocean-medium" size={28} />
          <h2 className="text-xl font-bold">絞り込み</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'daily', label: '日別' },
            { value: 'weekly', label: '曜日別' },
            { value: 'monthly', label: '月別' },
            { value: 'yearly', label: '年別' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value as FilterType)}
              className={`py-3 px-4 rounded-xl border-4 font-bold transition-all ${
                filterType === filter.value
                  ? 'bg-ocean-medium text-white border-ocean-deep shadow-[2px_2px_0px_0px_rgba(0,61,92,0.5)]'
                  : 'bg-white text-ocean-deep border-ocean-light hover:border-ocean-medium'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 折れ線グラフ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Icon className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">{currentConfig.label}の推移</h2>
        </div>

        {/* グラフエリア */}
        <div className="relative h-96 bg-ocean-surface/10 rounded-xl p-6 border-2 border-ocean-light">
          {/* Y軸ラベル */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-sm text-gray-600 pr-2">
            <span>{Math.ceil(maxValue)}{currentConfig.unit}</span>
            <span>{Math.ceil(maxValue * 0.75)}{currentConfig.unit}</span>
            <span>{Math.ceil(maxValue * 0.5)}{currentConfig.unit}</span>
            <span>{Math.ceil(maxValue * 0.25)}{currentConfig.unit}</span>
            <span>0{currentConfig.unit}</span>
          </div>

          {/* グラフ本体 */}
          <div className="ml-12 h-full relative">
            {/* グリッド線 */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${100 - percent}%` }}
              />
            ))}

            {/* 折れ線グラフ */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#0e7490" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* エリア塗りつぶし */}
              <path
                d={`
                  M 0,${400 - (chartData[0].value / maxValue) * 400}
                  ${chartData.map((d, i) => 
                    `L ${(i / (chartData.length - 1)) * 1000},${400 - (d.value / maxValue) * 400}`
                  ).join(' ')}
                  L 1000,400
                  L 0,400
                  Z
                `}
                fill="url(#areaGradient)"
              />

              {/* 折れ線 */}
              <path
                d={`
                  M 0,${400 - (chartData[0].value / maxValue) * 400}
                  ${chartData.map((d, i) => 
                    `L ${(i / (chartData.length - 1)) * 1000},${400 - (d.value / maxValue) * 400}`
                  ).join(' ')}
                `}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* データポイント */}
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={(i / (chartData.length - 1)) * 1000}
                    cy={400 - (d.value / maxValue) * 400}
                    r="8"
                    fill="#0891b2"
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer"
                    vectorEffect="non-scaling-stroke"
                  />
                  <title>{d.label}: {d.value}{currentConfig.unit}</title>
                </g>
              ))}
            </svg>
          </div>

          {/* X軸ラベル */}
          <div className="ml-12 mt-4 flex justify-between text-sm text-gray-600">
            {chartData.filter((_, i) => {
              // 表示するラベルを間引く
              const step = Math.ceil(chartData.length / 8)
              return i % step === 0 || i === chartData.length - 1
            }).map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className={`p-4 bg-gradient-to-br ${currentConfig.color} text-white rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]`}>
            <p className="text-xs opacity-90 mb-1">平均値</p>
            <p className="text-2xl font-bold">{average}{currentConfig.unit}</p>
          </div>

          <div className={`p-4 bg-gradient-to-br ${currentConfig.color} text-white rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]`}>
            <p className="text-xs opacity-90 mb-1">最大値</p>
            <p className="text-2xl font-bold">{max}{currentConfig.unit}</p>
          </div>

          <div className={`p-4 bg-gradient-to-br ${currentConfig.color} text-white rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]`}>
            <p className="text-xs opacity-90 mb-1">最小値</p>
            <p className="text-2xl font-bold">{min}{currentConfig.unit}</p>
          </div>
        </div>

        {/* データテーブル（スクロール可能） */}
        <div className="mt-6 max-h-64 overflow-y-auto border-2 border-ocean-light rounded-xl">
          <table className="w-full">
            <thead className="bg-ocean-surface/30 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-bold">期間</th>
                <th className="px-4 py-3 text-right font-bold">値</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((d, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{d.label}</td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {d.value}{currentConfig.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
