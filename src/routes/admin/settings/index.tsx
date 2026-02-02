import { createFileRoute, Link } from '@tanstack/react-router'
import React from 'react'
import {
  ArrowLeft,
  Compass,
  Trash2,
  Type,
  Code,
  UserCheck,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '../../../constants/routes.constant'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/common/Card'

interface SettingsTileProps {
  icon: LucideIcon
  title: string
  to: string
}

const SettingsTile: React.FC<SettingsTileProps> = ({
  icon: Icon,
  title,
  to,
}) => {
  return (
    <Link to={to} className="w-full h-48 group cursor-pointer">
      <Card
        variant="default"
        className="flex flex-col items-center justify-center h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[--variable-collection-inputs-border] hover:border-[--variable-collection-statusneutral-base]"
      >
        <Icon className="w-16 h-16 text-[--variable-collection-icons-white] mb-4 transition-colors duration-300 group-hover:text-[--variable-collection-statusneutral-base]" />
        <span className="text-lg font-semibold text-[--variable-collection-inputs-title]">
          {title}
        </span>
      </Card>
    </Link>
  )
}

const settingsData = [
  { title: 'App Shells', icon: Code, route: ROUTES.SETTINGS_APP_SHELLS },
  { title: 'Navigation', icon: Compass, route: ROUTES.SETTINGS_NAVIGATION },
  { title: 'User Rights', icon: UserCheck, route: ROUTES.SETTINGS_USER_RIGHTS },
  { title: 'Modules', icon: LayoutGrid, route: ROUTES.SETTINGS_MODULES },
  {
    title: 'Deletion Management',
    icon: Trash2,
    route: ROUTES.SETTINGS_DELETION_MANAGEMENT,
  },
  { title: 'Fonts', icon: Type, route: ROUTES.SETTINGS_FONTS },
]

function RouteComponent() {
  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.DASHBOARD}
        className="inline-flex items-center text-sm font-medium text-[--variable-collection-inputs-text] hover:text-[--variable-collection-inputs-title] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <Card size="lg" className="p-8">
        <CardHeader className="p-0 mb-6">
          <CardTitle
            as="h1"
            className="text-3xl font-bold text-[--variable-collection-inputs-title]"
          >
            Root Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {settingsData.map((setting) => (
              <SettingsTile
                key={setting.title}
                title={setting.title}
                icon={setting.icon}
                to={setting.route}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/admin/settings/')({
  component: RouteComponent,
})
