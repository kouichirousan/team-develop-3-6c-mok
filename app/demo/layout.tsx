import Sidebar from '@/components/Sidebar'

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-72 p-8">
        {children}
      </main>
    </div>
  )
}
