import BottomNav from '@/components/BottomNav'

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pb-20">
      <main className="w-full max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
