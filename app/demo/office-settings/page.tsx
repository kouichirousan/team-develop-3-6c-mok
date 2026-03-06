'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Users, Shield, Pencil, Trash2, Plus, Check, X } from 'lucide-react'

interface Department {
  id: string
  name: string
  memberCount: number
}

const initialDepartments: Department[] = [
  { id: 'dept-1', name: '開発部', memberCount: 8 },
  { id: 'dept-2', name: 'デザイン部', memberCount: 5 },
  { id: 'dept-3', name: '営業部', memberCount: 6 },
  { id: 'dept-4', name: '人事部', memberCount: 4 },
  { id: 'dept-5', name: '経営企画部', memberCount: 3 },
  { id: 'dept-6', name: 'マーケティング部', memberCount: 4 },
]

export default function OfficeSettingsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 部署管理state
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [isAdding, setIsAdding] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // ロールチェック
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      // 管理者でない場合はホームにリダイレクト
      router.push('/demo')
    } else {
      setIsAuthorized(true)
      setIsLoading(false)
    }
  }, [router])

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
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* ヘッダー */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Shield className="text-coral-orange" size={28} />
          <h1 className="text-2xl font-bold">オフィス設定</h1>
        </div>
        <p className="text-sm text-gray-600">管理者専用ページ</p>
      </motion.div>

      {/* 管理者専用バッジ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block px-4 py-2 bg-coral-orange/20 backdrop-blur-sm rounded-full border-2 border-coral-orange"
      >
        <span className="text-sm font-semibold text-coral-orange">👑 管理者専用</span>
      </motion.div>

      {/* オフィス基本情報 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">オフィス基本情報</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">
              オフィス名
            </label>
            <input
              type="text"
              defaultValue="東京本社オフィス"
              className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">
              住所
            </label>
            <input
              type="text"
              defaultValue="東京都渋谷区〇〇 1-2-3"
              className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                総座席数
              </label>
              <input
                type="number"
                defaultValue="50"
                className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">
                フロア数
              </label>
              <input
                type="number"
                defaultValue="3"
                className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 従業員数設定 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-ocean-medium" size={32} />
          <h2 className="text-2xl font-bold">従業員数設定</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">
              総従業員数
            </label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
            />
            <p className="text-sm text-gray-600 mt-2">
              現在登録されている従業員数を設定します
            </p>
          </div>
        </div>
      </motion.div>

      {/* 部署管理 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-ocean-medium" size={32} />
            <h2 className="text-2xl font-bold">部署管理</h2>
          </div>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              setNewDeptName('')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ocean-medium to-ocean-deep text-white font-bold rounded-xl border-4 border-ocean-deep shadow-[3px_3px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[5px_5px_0px_0px_rgba(0,61,92,0.5)] transition-all"
          >
            <Plus size={18} />
            <span>追加</span>
          </button>
        </div>

        {/* 成功メッセージ */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-100 border-2 border-green-400 rounded-xl flex items-center gap-2"
            >
              <Check className="text-green-600" size={18} />
              <span className="text-sm font-semibold text-green-700">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <AnimatePresence>
            {departments.map((dept) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-ocean-surface/30 rounded-xl border-2 border-ocean-light"
              >
                {editingId === dept.id ? (
                  <div className="flex items-center gap-2 flex-1 mr-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editName.trim()) {
                            setDepartments(departments.map(d =>
                              d.id === dept.id ? { ...d, name: editName.trim() } : d
                            ))
                            setEditingId(null)
                            setSuccessMessage('部署名を更新しました')
                            setTimeout(() => setSuccessMessage(null), 3000)
                          }
                        }
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (editName.trim()) {
                          setDepartments(departments.map(d =>
                            d.id === dept.id ? { ...d, name: editName.trim() } : d
                          ))
                          setEditingId(null)
                          setSuccessMessage('部署名を更新しました')
                          setTimeout(() => setSuccessMessage(null), 3000)
                        }
                      }}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold">{dept.name}</span>
                      <span className="ml-2 text-sm text-gray-500">{dept.memberCount}名</span>
                    </div>
                    <div className="flex gap-2">
                      {deleteConfirmId === dept.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600 font-semibold">削除？</span>
                          <button
                            onClick={() => {
                              const name = dept.name
                              setDepartments(departments.filter(d => d.id !== dept.id))
                              setDeleteConfirmId(null)
                              setSuccessMessage(`「${name}」を削除しました`)
                              setTimeout(() => setSuccessMessage(null), 3000)
                            }}
                            className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors"
                          >
                            はい
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            いいえ
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(dept.id)
                              setEditName(dept.name)
                              setIsAdding(false)
                            }}
                            className="flex items-center gap-1 px-3 py-2 bg-ocean-light text-white rounded-lg hover:bg-ocean-medium transition-colors"
                          >
                            <Pencil size={14} />
                            <span className="text-sm">編集</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(dept.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span className="text-sm">削除</span>
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* 新規追加フォーム */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-accent/10 rounded-xl border-4 border-dashed border-accent">
                  <p className="font-bold mb-3">🏢 新しい部署を追加</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="部署名を入力..."
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newDeptName.trim()) {
                          setDepartments([...departments, {
                            id: `dept-${Date.now()}`,
                            name: newDeptName.trim(),
                            memberCount: 0,
                          }])
                          setNewDeptName('')
                          setIsAdding(false)
                          setSuccessMessage(`「${newDeptName.trim()}」を追加しました`)
                          setTimeout(() => setSuccessMessage(null), 3000)
                        }
                        if (e.key === 'Escape') setIsAdding(false)
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (newDeptName.trim()) {
                          setDepartments([...departments, {
                            id: `dept-${Date.now()}`,
                            name: newDeptName.trim(),
                            memberCount: 0,
                          }])
                          setSuccessMessage(`「${newDeptName.trim()}」を追加しました`)
                          setTimeout(() => setSuccessMessage(null), 3000)
                          setNewDeptName('')
                          setIsAdding(false)
                        }
                      }}
                      disabled={!newDeptName.trim()}
                      className="px-5 py-3 bg-gradient-to-r from-ocean-medium to-ocean-deep text-white font-bold rounded-xl border-4 border-ocean-deep shadow-[3px_3px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[5px_5px_0px_0px_rgba(0,61,92,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      追加
                    </button>
                    <button
                      onClick={() => { setIsAdding(false); setNewDeptName('') }}
                      className="px-5 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl border-4 border-gray-400 hover:bg-gray-300 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isAdding && (
            <button
              onClick={() => { setIsAdding(true); setEditingId(null); setNewDeptName('') }}
              className="w-full py-3 border-4 border-dashed border-ocean-light text-ocean-medium font-semibold rounded-xl hover:bg-ocean-surface/20 transition-colors"
            >
              + 新しい部署を追加
            </button>
          )}
        </div>
      </motion.div>

      {/* 保存ボタン */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-4"
      >
        <button className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl border-4 border-gray-400 hover:bg-gray-300 transition-colors">
          キャンセル
        </button>
        <button className="px-8 py-4 bg-gradient-to-r from-ocean-medium to-ocean-deep text-white font-bold rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,61,92,0.5)] transition-all">
          変更を保存
        </button>
      </motion.div>
    </div>
  )
}
