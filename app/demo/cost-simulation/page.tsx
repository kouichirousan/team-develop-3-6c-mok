'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calculator, Building2, Sparkles, MapPin, Search, ArrowRight } from 'lucide-react'

interface AreaCostData {
  area: string
  region: string
  costPerTsubo: number
  averageRent: number
  popularity: 'high' | 'medium' | 'low'
}

const areaCostDatabase: AreaCostData[] = [
  { area: '東京都 渋谷区', region: '関東', costPerTsubo: 35000, averageRent: 5600000, popularity: 'high' },
  { area: '東京都 港区', region: '関東', costPerTsubo: 38000, averageRent: 6080000, popularity: 'high' },
  { area: '東京都 新宿区', region: '関東', costPerTsubo: 32000, averageRent: 5120000, popularity: 'high' },
  { area: '東京都 千代田区', region: '関東', costPerTsubo: 40000, averageRent: 6400000, popularity: 'high' },
  { area: '東京都 中央区', region: '関東', costPerTsubo: 36000, averageRent: 5760000, popularity: 'high' },
  { area: '東京都 品川区', region: '関東', costPerTsubo: 28000, averageRent: 4480000, popularity: 'medium' },
  { area: '東京都 目黒区', region: '関東', costPerTsubo: 27000, averageRent: 4320000, popularity: 'medium' },
  { area: '東京都 世田谷区', region: '関東', costPerTsubo: 22000, averageRent: 3520000, popularity: 'low' },
  { area: '神奈川県 横浜市', region: '関東', costPerTsubo: 20000, averageRent: 3200000, popularity: 'medium' },
  { area: '神奈川県 川崎市', region: '関東', costPerTsubo: 18000, averageRent: 2880000, popularity: 'low' },
  { area: '埼玉県 さいたま市', region: '関東', costPerTsubo: 15000, averageRent: 2400000, popularity: 'low' },
  { area: '大阪府 大阪市 北区', region: '関西', costPerTsubo: 25000, averageRent: 4000000, popularity: 'high' },
  { area: '大阪府 大阪市 中央区', region: '関西', costPerTsubo: 24000, averageRent: 3840000, popularity: 'high' },
  { area: '愛知県 名古屋市 中区', region: '中部', costPerTsubo: 20000, averageRent: 3200000, popularity: 'medium' },
  { area: '福岡県 福岡市 博多区', region: '九州', costPerTsubo: 18000, averageRent: 2880000, popularity: 'medium' },
  { area: '北海道 札幌市 中央区', region: '北海道', costPerTsubo: 14000, averageRent: 2240000, popularity: 'low' },
  { area: '宮城県 仙台市 青葉区', region: '東北', costPerTsubo: 15000, averageRent: 2400000, popularity: 'low' },
  { area: '広島県 広島市 中区', region: '中国', costPerTsubo: 16000, averageRent: 2560000, popularity: 'low' },
]

export default function CostSimulationPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 基本設定
  const totalEmployees = 30
  const [targetArea, setTargetArea] = useState(160) // 目標面積
  const [costPerTsubo, setCostPerTsubo] = useState(25000) // 坪単価
  const [utilizationRate, setUtilizationRate] = useState(60) // 出社率

  // エリア検索
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArea, setSelectedArea] = useState<AreaCostData | null>(null)

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

  // 面積モード：面積からコストを計算
  const calculatedCostFromArea = targetArea * costPerTsubo

  // AI推奨値を適用
  const applyRecommendation = () => {
    setTargetArea(recommendedArea)
  }

  // エリア検索結果
  const filteredAreas = searchQuery.trim()
    ? areaCostDatabase.filter(a => a.area.includes(searchQuery) || a.region.includes(searchQuery))
    : areaCostDatabase

  // エリア選択時に坪単価を反映
  const applyAreaCost = (area: AreaCostData) => {
    setSelectedArea(area)
    setCostPerTsubo(area.costPerTsubo)
  }

  const getPopularityLabel = (p: 'high' | 'medium' | 'low') => {
    switch (p) {
      case 'high': return { text: '人気', color: 'bg-red-100 text-red-700 border-red-300' }
      case 'medium': return { text: '標準', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' }
      case 'low': return { text: '穴場', color: 'bg-green-100 text-green-700 border-green-300' }
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

        {/* エリア別坪単価検索 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-ocean-medium" size={32} />
            <h2 className="text-2xl font-bold">エリア別 坪単価検索</h2>
          </div>

          <p className="text-gray-600 mb-4">
            オフィスの候補地を入力すると、そのエリアの坪単価を自動で反映します
          </p>

          {/* 検索バー */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="エリア名で検索（例: 渋谷、大阪、港区...）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light text-lg"
            />
          </div>

          {/* 選択中のエリア */}
          {selectedArea && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-5 bg-gradient-to-br from-ocean-medium to-ocean-deep text-white rounded-2xl border-4 border-ocean-deep"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80 mb-1">選択中のエリア</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <MapPin size={20} />
                    {selectedArea.area}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80 mb-1">坪単価</p>
                  <p className="text-3xl font-bold">¥{selectedArea.costPerTsubo.toLocaleString()}</p>
                  <p className="text-sm opacity-80">/坪/月</p>
                </div>
              </div>
              <p className="text-sm opacity-80 mt-3 flex items-center gap-1">
                <ArrowRight size={14} /> シミュレーション設定の坪単価に反映済み
              </p>
            </motion.div>
          )}

          {/* エリア一覧 */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {filteredAreas.map((area) => {
              const pop = getPopularityLabel(area.popularity)
              const isSelected = selectedArea?.area === area.area
              return (
                <motion.button
                  key={area.area}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => applyAreaCost(area)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'bg-ocean-surface border-ocean-deep shadow-[3px_3px_0px_0px_rgba(0,61,92,0.3)]'
                      : 'bg-white border-ocean-light hover:border-ocean-medium hover:shadow-[2px_2px_0px_0px_rgba(0,61,92,0.2)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className={isSelected ? 'text-ocean-deep' : 'text-gray-400'} />
                    <div>
                      <p className={`font-semibold ${isSelected ? 'text-ocean-deep' : ''}`}>{area.area}</p>
                      <p className="text-xs text-gray-500">{area.region}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${pop.color}`}>
                      {pop.text}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">¥{area.costPerTsubo.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">/坪/月</p>
                  </div>
                </motion.button>
              )
            })}
            {filteredAreas.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <MapPin size={40} className="mx-auto mb-3 opacity-50" />
                <p className="font-semibold">該当するエリアが見つかりません</p>
                <p className="text-sm mt-1">別のキーワードで検索してみてください</p>
              </div>
            )}
          </div>
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
                {/* 面積モード */}
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
