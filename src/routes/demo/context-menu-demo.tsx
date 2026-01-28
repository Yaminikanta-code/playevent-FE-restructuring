import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ContextMenu, Button } from '../../components/common'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Download,
  Share,
  Settings,
  Info,
  Star,
  Bookmark,
  Check,
  X,
} from 'lucide-react'

export const Route = createFileRoute('/demo/context-menu-demo')({
  component: ContextMenuDemo,
})

function ContextMenuDemo() {
  const [lastAction, setLastAction] = React.useState<string>('')

  const handleAction = (actionName: string) => {
    setLastAction(actionName)
    console.log(`${actionName} clicked`)
  }

  return (
    <div className="min-h-screen bg-midnight-darkest p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-inputs-title mb-2">
            ContextMenu Component Demo
          </h1>
          <p className="text-inputs-text">
            A reusable context menu component with flexible positioning and
            styling options
          </p>
        </div>

        {/* Action Feedback */}
        {lastAction && (
          <div className="fixed top-4 right-4 bg-inputs-background border border-inputs-border rounded-lg px-4 py-2 shadow-lg">
            <p className="text-inputs-title text-sm">
              Last action:{' '}
              <span className="text-divers-button">{lastAction}</span>
            </p>
          </div>
        )}

        {/* Example 1: Basic ContextMenu */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Basic ContextMenu
          </h2>
          <p className="text-inputs-text mb-6">
            A simple context menu with basic menu items and icons.
          </p>
          <ContextMenu
            items={[
              {
                icon: Edit,
                label: 'Edit',
                onClick: () => handleAction('Edit'),
              },
              {
                icon: Copy,
                label: 'Copy',
                onClick: () => handleAction('Copy'),
              },
              {
                icon: Download,
                label: 'Download',
                onClick: () => handleAction('Download'),
              },
            ]}
            trigger={
              <Button
                variant="primary"
                icon={MoreHorizontal}
                iconPosition="right"
              >
                Basic Menu
              </Button>
            }
            position="bottom-left"
          />
        </div>

        {/* Example 2: ContextMenu with Destructive Items */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            ContextMenu with Destructive Items
          </h2>
          <p className="text-inputs-text mb-6">
            Menu items can have destructive styling for dangerous actions like
            delete.
          </p>
          <ContextMenu
            items={[
              {
                icon: Edit,
                label: 'Edit',
                onClick: () => handleAction('Edit'),
              },
              {
                icon: Copy,
                label: 'Copy',
                onClick: () => handleAction('Copy'),
              },
              {
                icon: Trash2,
                label: 'Delete',
                onClick: () => handleAction('Delete'),
                destructive: true,
              },
            ]}
            trigger={
              <Button
                variant="primary"
                icon={MoreHorizontal}
                iconPosition="right"
              >
                With Destructive
              </Button>
            }
            position="bottom-left"
          />
        </div>

        {/* Example 3: ContextMenu with Disabled Items */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            ContextMenu with Disabled Items
          </h2>
          <p className="text-inputs-text mb-6">
            Menu items can be disabled to prevent certain actions.
          </p>
          <ContextMenu
            items={[
              {
                icon: Edit,
                label: 'Edit',
                onClick: () => handleAction('Edit'),
              },
              {
                icon: Download,
                label: 'Download',
                onClick: () => handleAction('Download'),
                disabled: true,
              },
              {
                icon: Trash2,
                label: 'Delete',
                onClick: () => handleAction('Delete'),
                destructive: true,
                disabled: true,
              },
            ]}
            trigger={
              <Button
                variant="primary"
                icon={MoreHorizontal}
                iconPosition="right"
              >
                With Disabled
              </Button>
            }
            position="bottom-left"
          />
        </div>

        {/* Example 4: Different Positions */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Different Positions
          </h2>
          <p className="text-inputs-text mb-6">
            The menu can be positioned relative to the trigger in four different
            ways.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ContextMenu
              items={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: () => handleAction('Edit'),
                },
                {
                  icon: Copy,
                  label: 'Copy',
                  onClick: () => handleAction('Copy'),
                },
              ]}
              trigger={<Button variant="secondary">Bottom Left</Button>}
              position="bottom-left"
            />
            <ContextMenu
              items={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: () => handleAction('Edit'),
                },
                {
                  icon: Copy,
                  label: 'Copy',
                  onClick: () => handleAction('Copy'),
                },
              ]}
              trigger={<Button variant="secondary">Bottom Right</Button>}
              position="bottom-right"
            />
            <ContextMenu
              items={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: () => handleAction('Edit'),
                },
                {
                  icon: Copy,
                  label: 'Copy',
                  onClick: () => handleAction('Copy'),
                },
              ]}
              trigger={<Button variant="secondary">Top Left</Button>}
              position="top-left"
            />
            <ContextMenu
              items={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: () => handleAction('Edit'),
                },
                {
                  icon: Copy,
                  label: 'Copy',
                  onClick: () => handleAction('Copy'),
                },
              ]}
              trigger={<Button variant="secondary">Top Right</Button>}
              position="top-right"
            />
          </div>
        </div>

        {/* Example 5: Large Menu */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Large Menu
          </h2>
          <p className="text-inputs-text mb-6">
            ContextMenu can handle many menu items with various icons.
          </p>
          <ContextMenu
            items={[
              {
                icon: Edit,
                label: 'Edit',
                onClick: () => handleAction('Edit'),
              },
              {
                icon: Copy,
                label: 'Copy',
                onClick: () => handleAction('Copy'),
              },
              {
                icon: Download,
                label: 'Download',
                onClick: () => handleAction('Download'),
              },
              {
                icon: Share,
                label: 'Share',
                onClick: () => handleAction('Share'),
              },
              {
                icon: Settings,
                label: 'Settings',
                onClick: () => handleAction('Settings'),
              },
              {
                icon: Info,
                label: 'Info',
                onClick: () => handleAction('Info'),
              },
              {
                icon: Star,
                label: 'Star',
                onClick: () => handleAction('Star'),
              },
              {
                icon: Bookmark,
                label: 'Bookmark',
                onClick: () => handleAction('Bookmark'),
              },
            ]}
            trigger={
              <Button
                variant="primary"
                icon={MoreHorizontal}
                iconPosition="right"
              >
                Large Menu
              </Button>
            }
            position="bottom-left"
          />
        </div>

        {/* Example 6: Custom Trigger */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Custom Trigger
          </h2>
          <p className="text-inputs-text mb-6">
            Any React element can be used as the trigger.
          </p>
          <ContextMenu
            items={[
              {
                icon: Check,
                label: 'Approve',
                onClick: () => handleAction('Approve'),
              },
              {
                icon: X,
                label: 'Reject',
                onClick: () => handleAction('Reject'),
              },
            ]}
            trigger={
              <div className="inline-block px-4 py-2 bg-divers-button hover:bg-divers-button/90 rounded-md cursor-pointer text-white font-medium transition-colors">
                Custom Trigger
              </div>
            }
            position="bottom-left"
          />
        </div>

        {/* Example 7: With Offset */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Custom Offset
          </h2>
          <p className="text-inputs-text mb-6">
            The offset between trigger and menu can be customized.
          </p>
          <div className="space-x-4">
            <ContextMenu
              items={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: () => handleAction('Edit'),
                },
                {
                  icon: Copy,
                  label: 'Copy',
                  onClick: () => handleAction('Copy'),
                },
              ]}
              trigger={<Button variant="secondary">Offset 0</Button>}
              position="bottom-left"
              offset={0}
            />
            <ContextMenu
              items={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: () => handleAction('Edit'),
                },
                {
                  icon: Copy,
                  label: 'Copy',
                  onClick: () => handleAction('Copy'),
                },
              ]}
              trigger={<Button variant="secondary">Offset 16</Button>}
              position="bottom-left"
              offset={16}
            />
            <ContextMenu
              items={[
                {
                  icon: Edit,
                  label: 'Edit',
                  onClick: () => handleAction('Edit'),
                },
                {
                  icon: Copy,
                  label: 'Copy',
                  onClick: () => handleAction('Copy'),
                },
              ]}
              trigger={<Button variant="secondary">Offset 32</Button>}
              position="bottom-left"
              offset={32}
            />
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="p-6 bg-inputs-background border border-inputs-border rounded-lg">
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Usage Instructions
          </h2>
          <div className="space-y-4 text-inputs-text">
            <p>
              <strong className="text-inputs-title">Import:</strong>
              <code className="block mt-2 bg-inputs-background-off p-3 rounded text-sm">
                import {'{'} ContextMenu {'}'} from '@/common'
              </code>
            </p>
            <p>
              <strong className="text-inputs-title">Basic Usage:</strong>
              <code className="block mt-2 bg-inputs-background-off p-3 rounded text-sm">
                {`<ContextMenu
  items={[
    {
      icon: Edit,
      label: 'Edit',
      onClick: () => console.log('Edit clicked'),
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => console.log('Delete clicked'),
      destructive: true,
    },
  ]}
  trigger={<Button>Open Menu</Button>}
  position="bottom-left"
  offset={8}
/>`}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
