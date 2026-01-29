import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AppSidebar } from '../../components/AppSidebar'
import { Button } from '../../components/common'
import { Menu, X } from 'lucide-react'
import logo from '@/logo.svg'

export const Route = createFileRoute('/demo/sidebar-demo')({
  component: SidebarDemo,
})

function SidebarDemo() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  return (
    <div className="min-h-screen bg-midnight-darkest">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-sidebar-background">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center">
            <img src={'image.png'} alt="Play Event" className="h-10 w-10" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Sidebar Demo</h1>
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
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-inputs-title mb-2">
                AppSidebar Component Demo
              </h1>
              <p className="text-inputs-text mb-4">
                A reusable sidebar component with settings and modules tabs,
                user profile, and responsive design.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileSidebar(true)}
                  className="lg:hidden"
                >
                  Show Mobile Sidebar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-inputs-title mb-4">
                  Features
                </h2>
                <ul className="space-y-3 text-inputs-text">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-divers-button rounded-full mt-2" />
                    <span>
                      <strong>Dual tabs:</strong> Settings and Modules views
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-divers-button rounded-full mt-2" />
                    <span>
                      <strong>Role-based access:</strong> Super admin sections
                      hidden for regular users
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-divers-button rounded-full mt-2" />
                    <span>
                      <strong>Module grouping:</strong> Active and inactive
                      modules grouped separately
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-divers-button rounded-full mt-2" />
                    <span>
                      <strong>User profile:</strong> Displays user info with
                      logout functionality
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-divers-button rounded-full mt-2" />
                    <span>
                      <strong>Responsive:</strong> Collapsible design with
                      mobile support
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-divers-button rounded-full mt-2" />
                    <span>
                      <strong>Mock data:</strong> Uses constants for modules and
                      routes
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-inputs-title mb-4">
                  Usage
                </h2>
                <div className="space-y-4 text-inputs-text">
                  <div>
                    <h3 className="font-semibold text-inputs-title mb-1">
                      Basic Usage
                    </h3>
                    <pre className="bg-midnight-darkest p-3 rounded text-sm overflow-x-auto">
                      {`import { AppSidebar } from '@/components/AppSidebar'

function Layout() {
  return (
    <div className="flex">
      <AppSidebar />
      {/* Main content */}
    </div>
  )
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold text-inputs-title mb-1">
                      With Collapsed State
                    </h3>
                    <pre className="bg-midnight-darkest p-3 rounded text-sm overflow-x-auto">
                      {`const [isCollapsed, setIsCollapsed] = useState(false)

<AppSidebar isCollapsed={isCollapsed} />`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-inputs-background border border-inputs-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-inputs-title mb-4">
                Implementation Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-midnight-darkest rounded">
                  <h3 className="font-semibold text-inputs-title mb-2">
                    Data Sources
                  </h3>
                  <p className="text-sm text-inputs-text">
                    Uses mock data from constants: modules.constant.ts and
                    routes.constant.ts
                  </p>
                </div>
                <div className="p-4 bg-midnight-darkest rounded">
                  <h3 className="font-semibold text-inputs-title mb-2">
                    Authentication
                  </h3>
                  <p className="text-sm text-inputs-text">
                    Directly integrates with useAuthStore for user data and
                    logout functionality
                  </p>
                </div>
                <div className="p-4 bg-midnight-darkest rounded">
                  <h3 className="font-semibold text-inputs-title mb-2">
                    Routing
                  </h3>
                  <p className="text-sm text-inputs-text">
                    Uses @tanstack/react-router for navigation with proper route
                    typing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
