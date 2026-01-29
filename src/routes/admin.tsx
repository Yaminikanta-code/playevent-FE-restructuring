import { Outlet, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { AppSidebar } from '@/components/AppSidebar'
import { Button } from '@/components/common'
import { Menu, X } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  // Check if current route is /admin/login
  const isLoginRoute = router.state.location.pathname === '/admin/login'

  // If it's the login route, don't render the sidebar layout
  if (isLoginRoute) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-midnight-darkest">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-sidebar-background">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center">
            <img src={'/image.png'} alt="Play Event" className="h-10 w-10" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Admin</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={showMobileSidebar ? X : Menu}
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar
            isCollapsed={isCollapsed}
            onCollapseChange={setIsCollapsed}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowMobileSidebar(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64">
              <AppSidebar
                isCollapsed={false}
                onCollapseChange={setIsCollapsed}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
