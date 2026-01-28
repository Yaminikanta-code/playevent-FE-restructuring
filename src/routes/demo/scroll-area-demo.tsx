import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Save, MoreHorizontal } from 'lucide-react'
import ScrollArea from '../../common/ScrollArea'
import IconButton from '../../common/IconButton'

export const Route = createFileRoute('/demo/scroll-area-demo')({
  component: ScrollAreaDemo,
})

function ScrollAreaDemo() {
  const [activeTab, setActiveTab] = useState('main')

  const tabs = [
    { id: 'main', label: 'Main' },
    { id: 'design', label: 'Design' },
    { id: 'texts', label: 'Texts' },
    { id: 'management', label: 'Management' },
  ]

  const headerActions = (
    <>
      <IconButton icon={Save} onClick={() => alert('Saved!')} tooltip="Save" />
      <IconButton icon={MoreHorizontal} onClick={() => {}} tooltip="More" />
    </>
  )

  const tabBar = (
    <div className="flex bg-midnight-darkest rounded-md p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-midnight-light text-inputs-title'
              : 'text-inputs-text hover:text-inputs-title'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-midnight-darkest p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-inputs-title">
          ScrollArea Component Demo
        </h1>

        {/* Example 1: With tabs and actions */}
        <div className="h-100">
          <ScrollArea
            title="New Event"
            headerActions={headerActions}
            headerContent={tabBar}
          >
            <div className="space-y-4">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="p-4 bg-midnight-darkest rounded-md text-inputs-title"
                >
                  Content item {i + 1} - Scroll to see more
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Example 2: Simple with maxHeight */}
        <ScrollArea title="Simple List" maxHeight={250}>
          <ul className="space-y-2">
            {Array.from({ length: 10 }, (_, i) => (
              <li
                key={i}
                className="p-3 bg-midnight-darkest rounded text-inputs-title"
              >
                List item {i + 1}
              </li>
            ))}
          </ul>
        </ScrollArea>

        {/* Example 3: With actions only */}
        <ScrollArea
          title="With Actions"
          maxHeight={200}
          headerActions={
            <IconButton icon={Save} onClick={() => {}} tooltip="Save" />
          }
        >
          <p className="text-inputs-text">
            This ScrollArea has header actions but no extra header content.
          </p>
        </ScrollArea>
      </div>
    </div>
  )
}
