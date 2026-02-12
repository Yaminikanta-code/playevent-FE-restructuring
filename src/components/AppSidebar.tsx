import { useState, useEffect } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { ROUTES } from '@/constants/routes.constant'
import { MOCK_MODULES, type Module } from '@/constants/modules.constant'
import {
  Users,
  Calendar,
  Puzzle,
  Settings,
  BarChart3,
  LogOut,
  Building2,
  FileText,
  Layers,
  List,
  Grid3x3,
  Brain,
  Gamepad2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/common'

// Icon mapping for modules
const iconMap: Record<string, LucideIcon> = {
  Brain: Brain,
  Grid3x3: Grid3x3,
  BarChart3: BarChart3,
  Gamepad2: Gamepad2,
  Puzzle: Puzzle,
  List: List,
}

const settingsNavigation = [
  {
    title: 'Super Admin',
    superAdminOnly: true,
    items: [
      { title: 'Clients', url: ROUTES.CLIENTS, icon: Building2 },
      { title: 'Contracts', url: ROUTES.CONTRACTS, icon: FileText },
      { title: 'Root settings', url: ROUTES.SETTINGS, icon: Settings },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Events', url: ROUTES.EVENTS, icon: Calendar },
      { title: 'Groups', url: ROUTES.GROUPS, icon: Layers },
      { title: 'Users', url: ROUTES.USERS, icon: Users },
      { title: 'Assets lists', url: ROUTES.ASSETS, icon: List },
    ],
  },
]

type SidebarTab = 'settings' | 'modules'

interface ModuleGroup {
  title: string
  status: string
  color: string
  modules: Module[]
}

interface AppSidebarProps {
  isCollapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

export function AppSidebar({
  isCollapsed = false,
  onCollapseChange,
}: AppSidebarProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const [activeTab, setActiveTab] = useState<SidebarTab>('settings')
  const [modules, setModules] = useState<Module[]>([])
  const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed)

  // Sync with external prop changes
  useEffect(() => {
    setInternalCollapsed(isCollapsed)
  }, [isCollapsed])

  const handleToggleCollapse = () => {
    const newCollapsed = !internalCollapsed
    setInternalCollapsed(newCollapsed)
    onCollapseChange?.(newCollapsed)
  }

  const collapsed = internalCollapsed

  const isSuperAdmin = user?.role === 'superadmin'

  const isActive = (path: string) =>
    router.state.location.pathname === path ||
    router.state.location.pathname.startsWith(path + '/')

  const handleLogout = () => {
    logout()
    router.navigate({ to: ROUTES.LOGIN })
  }

  // Load mock modules
  useEffect(() => {
    setModules(MOCK_MODULES)
  }, [])

  // Group modules by status for the MODULES tab
  const moduleGroups: ModuleGroup[] = [
    {
      title: 'Active',
      status: 'active',
      color: 'text-[#059669]',
      modules: modules.filter((m) => m.is_active),
    },
    {
      title: 'Not Active',
      status: 'not_active',
      color: 'text-destructive',
      modules: modules.filter((m) => !m.is_active),
    },
  ]

  const getModuleIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Puzzle
  }

  return (
    <div className="flex flex-col h-screen border-r border-border bg-sidebar-background sticky top-0 relative">
      {/* Collapse button on border */}
      <button
        onClick={handleToggleCollapse}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-sidebar-background flex items-center justify-center hover:bg-muted/50 transition-colors"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-muted-foreground" />
        )}
      </button>

      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3 border border-border rounded-lg p-2">
          <div className="h-10 w-10 flex items-center justify-center flex-shrink-0">
            <img src={'/image.png'} alt="Play Event" className="h-10 w-10" />
          </div>
          {!collapsed && (
            <h2 className="text-lg font-bold text-foreground">Play Event</h2>
          )}
        </div>

        {/* Back to dashboard */}
        {!collapsed && (
          <button
            onClick={() => router.navigate({ to: ROUTES.DASHBOARD })}
            className="flex items-center gap-2 mt-4 text-foreground hover:text-foreground/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to dashboard</span>
          </button>
        )}

        {/* SETTINGS / MODULES Tabs */}
        {!collapsed && (
          <div className="flex mt-4 border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'settings'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'modules'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Modules
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'settings' ? (
          // SETTINGS Tab Content
          <>
            {settingsNavigation.map((section, idx) => {
              // Hide Super Admin section for non-super admins
              if (section.superAdminOnly && !isSuperAdmin) {
                return null
              }

              return (
                <div key={idx} className="mb-6">
                  {!collapsed && (
                    <h3 className="text-xs font-semibold text-[#7E77E8] uppercase tracking-wider mb-2">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      // Hide Groups and Users for non-super admins
                      if (
                        !isSuperAdmin &&
                        (item.title === 'Groups' || item.title === 'Users')
                      ) {
                        return null
                      }

                      const isItemActive = isActive(item.url)
                      return (
                        <Link
                          key={item.title}
                          to={item.url}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                            isItemActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-foreground/80 hover:bg-sidebar-accent/50 hover:text-foreground'
                          } ${collapsed ? 'justify-center' : ''}`}
                        >
                          <item.icon
                            className={collapsed ? 'h-5 w-5' : 'h-4 w-4'}
                          />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          // MODULES Tab Content
          <>
            {moduleGroups.map((group, idx) => (
              <div key={idx} className="mb-6">
                {!collapsed && (
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider mb-2 ${group.color}`}
                  >
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.modules.length > 0
                    ? group.modules.map((module) => {
                        const IconComponent = getModuleIcon(module.icon)
                        return (
                          <div
                            key={module.id}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-foreground/80 hover:bg-sidebar-accent/50 hover:text-foreground cursor-default ${collapsed ? 'justify-center' : ''}`}
                          >
                            <IconComponent
                              className={collapsed ? 'h-5 w-5' : 'h-4 w-4'}
                            />
                            {!collapsed && <span>{module.name}</span>}
                          </div>
                        )
                      })
                    : !collapsed && (
                        <p className="text-xs text-muted-foreground px-3 py-2">
                          No modules
                        </p>
                      )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}
        >
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        <div className="mt-2">
          {collapsed ? (
            <button
              onClick={handleLogout}
              className="w-full p-2 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
              icon={LogOut}
              iconPosition="left"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
