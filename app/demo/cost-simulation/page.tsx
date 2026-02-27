'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calculator, Building2, Sparkles } from 'lucide-react'

type SimulationMode = 'cost' | 'area'

export default function CostSimulationPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('area')

  // 基本設定
  const totalEmployees = 30
  const [targetCost, setTargetCost] = useState(4000000) // 目標月額コスト
  const [targetArea, setTargetArea] = useState(160) // 目標面積
  const [costPerTsubo, setCostPerTsubo] = useState(25000) // 坪単価
  const [utilizationRate, setUtilizationRate] = useState(60) // 出社率

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      router.push('/demo')
    } else {
      setIsAuthorized(true)
      setIsLoading(false)
    }
  }, [router])

  // AI推奨値の計算
  const recommendedSeats = Math.ceil(totalEmployees * (utilizationRate / 100) * 1.2) // 20%バッファ
  const recommendedArea = Math.ceil(recommendedSeats * 3.5) // 1席あたり3.5坪
  const recommendedCost = recommendedArea * costPerTsubo

  // コストモード：コストから面積を計算
  const calculatedAreaFromCost = Math.floor(targetCost / costPerTsubo)
  
  // 面積モード：面積からコストを計算
  const calculatedCostFromArea = targetArea * costPerTsubo

  // AI推奨値を適用
  const applyRecommendation = () => {
    if (simulationMode === 'cost') {
      setTargetCost(recommendedCost)
    } else {
      setTargetArea(recommendedArea)
    }
  }

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          🌊
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* ヘッダー */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="text-coral-orange" size={40} />
          <h1 className="text-4xl font-bold">コストシミュレーション</h1>
        </div>
        <p className="text-gray-600">オフィスコストの最適化を検討</p>
      </motion.div>

      {/* 管理者専用バッジ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block px-4 py-2 bg-coral-orange/20 backdrop-blur-sm rounded-full border-2 border-coral-orange"
      >
        <span className="text-sm font-semibold text-coral-orange">👑 管理者専用</span>
      </motion.div>

      {/* モード切替 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 justify-center"
      >
        <button
          onClick={() => setSimulationMode('area')}
          className={`px-8 py-4 rounded-xl border-4 font-bold text-lg transition-all ${
            simulationMode === 'area'
              ? 'bg-gradient-to-r from-ocean-medium to-ocean-deep text-white border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]'
              : 'bg-white text-ocean-deep border-ocean-light hover:border-ocean-medium'
          }`}
        >
          📐 面積からコストを計算
        </button>
        <button
          onClick={() => setSimulationMode('cost')}
          className={`px-8 py-4 rounded-xl border-4 font-bold text-lg transition-all ${
            simulationMode === 'cost'
              ? 'bg-gradient-to-r from-ocean-medium to-ocean-deep text-white border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)]'
              : 'bg-white text-ocean-deep border-ocean-light hover:border-ocean-medium'
          }`}
        >
          💰 コストから面積を計算
        </button>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* AI推奨値 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-accent/20 to-sand/20 p-6 rounded-3xl border-4 border-accent shadow-[8px_8px_0px_0px_rgba(255,193,7,0.3)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-accent" size={32} />
            <h2 className="text-2xl font-bold">AI推奨値</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-white/80 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">出社率 {utilizationRate}%</p>
              <p className="text-2xl font-bold">{recommendedSeats}席</p>
              <p className="text-xs text-gray-600">（20%バッファ込み）</p>
            </div>

            <div className="p-4 bg-white/80 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">推奨面積</p>
              <p className="text-2xl font-bold">{recommendedArea}坪</p>
              <p className="text-xs text-gray-600">（{(recommendedArea * 3.3).toFixed(1)}㎡）</p>
            </div>

            <div className="p-4 bg-white/80 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">推奨コスト</p>
              <p className="text-2xl font-bold">¥{(recommendedCost / 10000).toFixed(0)}万</p>
              <p className="text-xs text-gray-600">/月</p>
            </div>
          </div>

          <button
            onClick={applyRecommendation}
            className="w-full py-3 bg-accent text-ocean-deep font-bold text-lg rounded-xl border-4 border-ocean-deep hover:shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] transition-all"
          >
            ✨ 推奨値をバーに反映
          </button>
        </motion.div>

        {/* シミュレーション設定 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
        >
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="text-ocean-medium" size={32} />
            <h2 className="text-2xl font-bold">シミュレーション設定</h2>
          </div>

          <div className="space-y-8">
            {/* 出社率設定 */}
            <div>
              <label className="block text-lg font-bold text-ocean-deep mb-3">
                想定出社率: {utilizationRate}%
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={utilizationRate}
                onChange={(e) => setUtilizationRate(Number(e.target.value))}
                className="w-full h-4 bg-ocean-surface rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0891b2 0%, #0891b2 ${utilizationRate}%, #e0f2fe ${utilizationRate}%, #e0f2fe 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>20%</span>
                <span>60%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 坪単価設定 */}
            <div>
              <label className="block text-lg font-bold text-ocean-deep mb-3">
                坪単価: ¥{costPerTsubo.toLocaleString()}/坪/月
              </label>
              <input
                type="range"
                min="10000"
                max="40000"
                step="1000"
                value={costPerTsubo}
                onChange={(e) => setCostPerTsubo(Number(e.target.value))}
                className="w-full h-4 bg-ocean-surface rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0891b2 0%, #0891b2 ${((costPerTsubo - 10000) / 30000) * 100}%, #e0f2fe ${((costPerTsubo - 10000) / 30000) * 100}%, #e0f2fe 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>¥10,000</span>
                <span>¥25,000</span>
                <span>¥40,000</span>
              </div>
            </div>

            <div className="border-t-4 border-ocean-light pt-8">
              {simulationMode === 'area' ? (
                /* 面積モード */
                <div>
                  <label className="block text-lg font-bold text-ocean-deep mb-3">
                    目標面積: {targetArea}坪
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="300"
                    step="10"
                    value={targetArea}
                    onChange={(e) => setTargetArea(Number(e.target.value))}
                    className="w-full h-6 bg-ocean-surface rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${((targetArea - 80) / 220) * 100}%, #fed7aa ${((targetArea - 80) / 220) * 100}%, #fed7aa 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>80坪</span>
                    <span>190坪</span>
                    <span>300坪</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    ({(targetArea * 3.3).toFixed(1)}㎡)
                  </p>
                  <div className="mt-6 p-6 bg-gradient-to-br from-coral-orange to-coral-pink text-white rounded-2xl border-4 border-ocean-deep">
                    <p className="text-sm opacity-90 mb-2">計算されるコスト</p>
                    <p className="text-5xl font-bold">
                      ¥{(calculatedCostFromArea / 10000).toFixed(0)}万
                    </p>
                    <p className="text-lg mt-2">/月</p>
                    <p className="text-sm opacity-90 mt-3">
                      年間: ¥{(calculatedCostFromArea * 12 / 10000).toFixed(0)}万
                    </p>
                  </div>
                </div>
              ) : (
                /* コストモード */
                <div>
                  <label className="block text-lg font-bold text-ocean-deep mb-3">
                    目標月額コスト: ¥{(targetCost / 10000).toFixed(0)}万
                  </label>
                  <input
                    type="range"
                    min="2000000"
                    max="8000000"
                    step="100000"
                    value={targetCost}
                    onChange={(e) => setTargetCost(Number(e.target.value))}
                    className="w-full h-6 bg-ocean-surface rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${((targetCost - 2000000) / 6000000) * 100}%, #fed7aa ${((targetCost - 2000000) / 6000000) * 100}%, #fed7aa 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>¥200万</span>
                    <span>¥500万</span>
                    <span>¥800万</span>
                  </div>
                  <div className="mt-6 p-6 bg-gradient-to-br from-coral-orange to-coral-pink text-white rounded-2xl border-4 border-ocean-deep">
                    <p className="text-sm opacity-90 mb-2">計算される面積</p>
                    <p className="text-5xl font-bold">
                      {calculatedAreaFromCost}坪
                    </p>
                    <p className="text-sm opacity-90 mt-3">
                      ({(calculatedAreaFromCost * 3.3).toFixed(1)}㎡)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
