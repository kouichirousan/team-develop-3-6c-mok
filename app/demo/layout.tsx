import HamburgerMenu from '@/components/HamburgerMenu'

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <HamburgerMenu />
      <main className="w-full max-w-lg mx-auto">
        {children}
      </main>
    </div>
  )
}
