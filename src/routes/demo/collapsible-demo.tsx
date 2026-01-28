import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Collapsible } from '../../components/common'
import { Edit, Trash2, Eye, MoreHorizontal, Plus, Settings } from 'lucide-react'
import { Button, IconButton } from '../../components/common'

export const Route = createFileRoute('/demo/collapsible-demo')({
  component: CollapsibleDemo,
})

function CollapsibleDemo() {
  const [controlledExpanded, setControlledExpanded] = React.useState(false)

  return (
    <div className="min-h-screen bg-midnight-darkest p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-inputs-title mb-2">
            Collapsible Component Demo
          </h1>
          <p className="text-inputs-text">
            A reusable collapsible component with smooth animations and flexible
            action icons
          </p>
        </div>

        {/* Example 1: Basic Collapsible */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Basic Collapsible
          </h2>
          <Collapsible title="Basic Example" defaultExpanded={true}>
            <p className="text-inputs-text">
              This is a basic collapsible component. Click the header to toggle
              the visibility of this content area. The animation is smooth and
              uses CSS transitions.
            </p>
          </Collapsible>
        </div>

        {/* Example 2: Collapsible with 1 Action Icon */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Collapsible with 1 Action Icon
          </h2>
          <Collapsible
            title="Single Action"
            actions={[
              <IconButton
                key="edit"
                icon={Edit}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Edit clicked')}
              />,
            ]}
          >
            <p className="text-inputs-text">
              This collapsible has one action icon on the right side of the
              header.
            </p>
          </Collapsible>
        </div>

        {/* Example 3: Collapsible with 2 Action Icons */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Collapsible with 2 Action Icons
          </h2>
          <Collapsible
            title="Two Actions"
            actions={[
              <IconButton
                key="edit"
                icon={Edit}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Edit clicked')}
              />,
              <IconButton
                key="delete"
                icon={Trash2}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Delete clicked')}
              />,
            ]}
          >
            <p className="text-inputs-text">
              This collapsible has two action icons on the right side of the
              header.
            </p>
          </Collapsible>
        </div>

        {/* Example 4: Collapsible with 4 Action Icons (Maximum) */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Collapsible with 4 Action Icons (Maximum)
          </h2>
          <Collapsible
            title="Four Actions"
            actions={[
              <IconButton
                key="view"
                icon={Eye}
                variant="ghost"
                size="sm"
                onClick={() => console.log('View clicked')}
              />,
              <IconButton
                key="edit"
                icon={Edit}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Edit clicked')}
              />,
              <IconButton
                key="delete"
                icon={Trash2}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Delete clicked')}
              />,
              <IconButton
                key="more"
                icon={MoreHorizontal}
                variant="ghost"
                size="sm"
                onClick={() => console.log('More clicked')}
              />,
            ]}
          >
            <p className="text-inputs-text">
              This collapsible has four action icons, which is the maximum
              supported. Click on any icon to trigger its action without
              toggling the collapsible.
            </p>
          </Collapsible>
        </div>

        {/* Example 5: Collapsible with 5 Action Icons (Should only show 4) */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Collapsible with 5 Action Icons (Extra Hidden)
          </h2>
          <Collapsible
            title="Five Actions"
            actions={[
              <IconButton
                key="view"
                icon={Eye}
                variant="ghost"
                size="sm"
                onClick={() => console.log('View clicked')}
              />,
              <IconButton
                key="edit"
                icon={Edit}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Edit clicked')}
              />,
              <IconButton
                key="delete"
                icon={Trash2}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Delete clicked')}
              />,
              <IconButton
                key="settings"
                icon={Settings}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Settings clicked')}
              />,
              <IconButton
                key="add"
                icon={Plus}
                variant="ghost"
                size="sm"
                onClick={() => console.log('Add clicked')}
              />,
            ]}
          >
            <p className="text-inputs-text">
              This collapsible has five action icons, but only the first four
              are displayed. The fifth icon is automatically hidden.
            </p>
          </Collapsible>
        </div>

        {/* Example 6: Collapsible with Rich Content */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Collapsible with Rich Content
          </h2>
          <Collapsible
            title="Rich Content"
            actions={[
              <Button key="save" variant="primary" size="sm">
                Save
              </Button>,
            ]}
          >
            <div className="space-y-4">
              <p className="text-inputs-text">
                This collapsible contains rich content including multiple
                paragraphs, lists, and other elements.
              </p>
              <ul className="list-disc list-inside space-y-2 text-inputs-text">
                <li>Feature 1: Smooth animations</li>
                <li>Feature 2: Flexible action icons</li>
                <li>Feature 3: Customizable styling</li>
                <li>Feature 4: Accessible keyboard navigation</li>
              </ul>
              <div className="p-4 bg-inputs-background rounded-md">
                <p className="text-inputs-text">
                  This is a nested block within the collapsible content.
                </p>
              </div>
            </div>
          </Collapsible>
        </div>

        {/* Example 7: Controlled Collapsible */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Controlled Collapsible
          </h2>
          <div className="space-y-4">
            <Button
              onClick={() => setControlledExpanded(!controlledExpanded)}
              variant="primary"
            >
              {controlledExpanded ? 'Collapse' : 'Expand'}
            </Button>
            <Collapsible
              title="Controlled State"
              expanded={controlledExpanded}
              onExpandedChange={setControlledExpanded}
            >
              <p className="text-inputs-text">
                This collapsible is controlled by external state. The button
                above toggles its expanded state programmatically.
              </p>
            </Collapsible>
          </div>
        </div>

        {/* Example 8: Multiple Collapsibles */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Multiple Collapsibles
          </h2>
          <div className="space-y-4">
            <Collapsible title="Section 1" defaultExpanded={true}>
              <p className="text-inputs-text">Content for section 1.</p>
            </Collapsible>
            <Collapsible title="Section 2">
              <p className="text-inputs-text">Content for section 2.</p>
            </Collapsible>
            <Collapsible title="Section 3">
              <p className="text-inputs-text">Content for section 3.</p>
            </Collapsible>
          </div>
        </div>

        {/* Example 9: Collapsible with Form Elements */}
        <div>
          <h2 className="text-2xl font-semibold text-inputs-title mb-4">
            Collapsible with Form Elements
          </h2>
          <Collapsible
            title="Form Section"
            actions={[
              <Button key="submit" variant="success" size="sm">
                Submit
              </Button>,
            ]}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-inputs-title mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-inputs-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-inputs-background text-inputs-text"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-inputs-title mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-inputs-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-inputs-background text-inputs-text"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
