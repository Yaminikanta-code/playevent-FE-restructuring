import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-2">
            Users
          </h2>
          <p className="text-inputs-text">
            Manage system users and permissions
          </p>
        </div>
        <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-2">
            Modules
          </h2>
          <p className="text-inputs-text">Configure and activate modules</p>
        </div>
        <div className="bg-inputs-background border border-inputs-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-inputs-title mb-2">
            Settings
          </h2>
          <p className="text-inputs-text">
            System configuration and preferences
          </p>
        </div>
      </div>
      <div className="mt-8 bg-inputs-background border border-inputs-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-inputs-title mb-4">
          Recent Activity
        </h2>
        <p className="text-inputs-text">No recent activity to display.</p>
      </div>
    </div>
  )
}
