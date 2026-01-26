import { createFileRoute } from '@tanstack/react-router'
import { Button, IconButton } from '../common'
import { Plus, Trash2, Check, X, Settings, Search } from 'lucide-react'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-8 space-y-8 bg-inputs-background min-h-screen">
      <h1 className="text-4xl font-bold text-inputs-title mb-8">
        Button Components
      </h1>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Button Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Button Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="sm">
            Small Button
          </Button>
          <Button variant="primary" size="md">
            Medium Button
          </Button>
          <Button variant="primary" size="lg">
            Large Button
          </Button>
        </div>
      </section>

      {/* Buttons with Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Buttons with Icons
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={Plus} iconPosition="left">
            Add New
          </Button>
          <Button variant="secondary" icon={Settings} iconPosition="right">
            Settings
          </Button>
          <Button variant="destructive" icon={Trash2} iconPosition="left">
            Delete
          </Button>
          <Button variant="success" icon={Check} iconPosition="left">
            Confirm
          </Button>
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Loading State
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" isLoading>
            Loading...
          </Button>
          <Button variant="secondary" isLoading>
            Processing
          </Button>
        </div>
      </section>

      {/* Full Width Button */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Full Width Button
        </h2>
        <div className="max-w-md">
          <Button variant="primary" fullWidth>
            Full Width Button
          </Button>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Disabled State
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" disabled>
            Disabled Primary
          </Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Icon Buttons
        </h2>
        <div className="flex flex-wrap gap-4">
          <IconButton variant="primary" icon={Plus} tooltip="Add" />
          <IconButton variant="secondary" icon={Settings} tooltip="Settings" />
          <IconButton variant="destructive" icon={Trash2} tooltip="Delete" />
          <IconButton variant="success" icon={Check} tooltip="Confirm" />
          <IconButton variant="outline" icon={Search} tooltip="Search" />
          <IconButton variant="ghost" icon={X} tooltip="Close" />
        </div>
      </section>

      {/* Icon Button Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Icon Button Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <IconButton variant="primary" icon={Plus} size="sm" tooltip="Small" />
          <IconButton
            variant="primary"
            icon={Plus}
            size="md"
            tooltip="Medium"
          />
          <IconButton variant="primary" icon={Plus} size="lg" tooltip="Large" />
        </div>
      </section>

      {/* Icon Button Loading */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-inputs-title">
          Icon Button Loading
        </h2>
        <div className="flex flex-wrap gap-4">
          <IconButton variant="primary" icon={Plus} isLoading />
          <IconButton variant="secondary" icon={Settings} isLoading />
          <IconButton variant="destructive" icon={Trash2} isLoading />
        </div>
      </section>
    </div>
  )
}
