'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Pencil, Trash2, Shield, Check, X } from 'lucide-react'

interface Department {
  id: string
  name: string
  memberCount: number
  color: string
}

const initialDepartments: Department[] = [
  { id: 'dept-1', name: '開発部', memberCount: 8, color: '#0891b2' },
  { id: 'dept-2', name: 'デザイン部', memberCount: 5, color: '#8b5cf6' },
  { id: 'dept-3', name: '営業部', memberCount: 6, color: '#f97316' },
  { id: 'dept-4', name: '人事部', memberCount: 4, color: '#10b981' },
  { id: 'dept-5', name: '経営企画部', memberCount: 3, color: '#ef4444' },
  { id: 'dept-6', name: 'マーケティング部', memberCount: 4, color: '#ec4899' },
]

const departmentColors = [
  '#0891b2', '#8b5cf6', '#f97316', '#10b981', '#ef4444',
  '#ec4899', '#6366f1', '#14b8a6', '#f59e0b', '#3b82f6',
]

export default function DepartmentsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [isAdding, setIsAdding] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      router.push('/demo')
    } else {
      setIsAuthorized(true)
      setIsLoading(false)
    }
  }, [router])

  const handleAddDepartment = () => {
    if (!newDeptName.trim()) return

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: newDeptName.trim(),
      memberCount: 0,
      color: departmentColors[departments.length % departmentColors.length],
    }

    setDepartments([...departments, newDept])
    setNewDeptName('')
    setIsAdding(false)
    setShowSuccess(`「${newDept.name}」を追加しました`)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleEditDepartment = (id: string) => {
    if (!editName.trim()) return

    setDepartments(departments.map(dept =>
      dept.id === id ? { ...dept, name: editName.trim() } : dept
    ))
    setEditingId(null)
    setEditName('')
    setShowSuccess('部署名を更新しました')
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleDeleteDepartment = (id: string) => {
    const dept = departments.find(d => d.id === id)
    setDepartments(departments.filter(d => d.id !== id))
    setDeleteConfirmId(null)
    setShowSuccess(`「${dept?.name}」を削除しました`)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const startEdit = (dept: Department) => {
    setEditingId(dept.id)
    setEditName(dept.name)
    setIsAdding(false)
  }

  const totalMembers = departments.reduce((sum, d) => sum + d.memberCount, 0)

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
          <Users className="text-coral-orange" size={40} />
          <h1 className="text-4xl font-bold">部署管理</h1>
        </div>
        <p className="text-gray-600">部署の追加・編集・削除を管理</p>
      </motion.div>

      {/* 管理者専用バッジ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block px-4 py-2 bg-coral-orange/20 backdrop-blur-sm rounded-full border-2 border-coral-orange"
      >
        <span className="text-sm font-semibold text-coral-orange">👑 管理者専用</span>
      </motion.div>

      {/* 成功メッセージ */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-100 border-4 border-green-500 rounded-xl flex items-center gap-3"
          >
            <Check className="text-green-600" size={24} />
            <span className="font-semibold text-green-700">{showSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* サマリー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div className="p-5 bg-gradient-to-br from-ocean-medium to-ocean-deep text-white rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)]">
          <p className="text-sm opacity-80">総部署数</p>
          <p className="text-4xl font-bold mt-1">{departments.length}</p>
        </div>
        <div className="p-5 bg-gradient-to-br from-coral-orange to-coral-pink text-white rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)]">
          <p className="text-sm opacity-80">総従業員数</p>
          <p className="text-4xl font-bold mt-1">{totalMembers}</p>
        </div>
        <div className="p-5 bg-gradient-to-br from-accent to-yellow-300 text-ocean-deep rounded-2xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)]">
          <p className="text-sm opacity-80">平均人数</p>
          <p className="text-4xl font-bold mt-1">{departments.length > 0 ? Math.round(totalMembers / departments.length) : 0}</p>
        </div>
      </motion.div>

      {/* 部署一覧 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-3xl border-4 border-ocean-deep shadow-[8px_8px_0px_0px_rgba(0,61,92,0.3)]"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="text-ocean-medium" size={32} />
            <h2 className="text-2xl font-bold">部署一覧</h2>
          </div>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              setNewDeptName('')
            }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-ocean-medium to-ocean-deep text-white font-bold rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,61,92,0.5)] transition-all"
          >
            <Plus size={20} />
            <span>新しい部署を追加</span>
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-ocean-surface/20 rounded-xl border-2 border-ocean-light hover:border-ocean-medium transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-ocean-deep"
                    style={{ backgroundColor: dept.color }}
                  />
                  {editingId === dept.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditDepartment(dept.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        className="px-3 py-2 rounded-lg border-2 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light"
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditDepartment(dept.id)}
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
                    <div>
                      <span className="font-semibold text-lg">{dept.name}</span>
                      <span className="ml-3 text-sm text-gray-500">{dept.memberCount}名</span>
                    </div>
                  )}
                </div>

                {editingId !== dept.id && (
                  <div className="flex gap-2">
                    {deleteConfirmId === dept.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600 font-semibold">削除しますか？</span>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="px-3 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors"
                        >
                          はい
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          いいえ
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(dept)}
                          className="flex items-center gap-1 px-4 py-2 bg-ocean-light text-white rounded-lg hover:bg-ocean-medium transition-colors"
                        >
                          <Pencil size={14} />
                          <span className="text-sm font-semibold">編集</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(dept.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span className="text-sm font-semibold">削除</span>
                        </button>
                      </>
                    )}
                  </div>
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
                <div className="p-5 bg-accent/10 rounded-xl border-4 border-dashed border-accent">
                  <h3 className="font-bold text-lg mb-4">🏢 新しい部署を追加</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="部署名を入力..."
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddDepartment()
                        if (e.key === 'Escape') setIsAdding(false)
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border-4 border-ocean-deep focus:outline-none focus:ring-2 focus:ring-ocean-light text-lg"
                      autoFocus
                    />
                    <button
                      onClick={handleAddDepartment}
                      disabled={!newDeptName.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-ocean-medium to-ocean-deep text-white font-bold rounded-xl border-4 border-ocean-deep shadow-[4px_4px_0px_0px_rgba(0,61,92,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,61,92,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      追加
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false)
                        setNewDeptName('')
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl border-4 border-gray-400 hover:bg-gray-300 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
