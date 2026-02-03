import { createFileRoute, Link } from '@tanstack/react-router'
import logo from '@/logo.svg'

export const Route = createFileRoute('/demo/')({
  component: App,
})

function App() {
  const demoRoutes = [
    { path: '/demo/collapsible-demo', label: 'Collapsible Demo' },
    { path: '/demo/context-menu-demo', label: 'Context Menu Demo' },
    { path: '/demo/form-test', label: 'Form Test' },
    { path: '/demo/modal-test', label: 'Modal Test' },
    { path: '/demo/scroll-area-demo', label: 'Scroll Area Demo' },
    { path: '/demo/table-demo', label: 'Table Demo' },
    { path: '/test', label: 'Test' },
    { path: '/demo/tanstack-query', label: 'TanStack Query Demo' },
    { path: '/demo/sidebar-demo', label: 'Sidebar Demo' },
  ]

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-midnight-darkest text-inputs-title">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p className="text-inputs-text mb-8">
          Edit{' '}
          <code className="bg-inputs-background px-2 py-1 rounded">
            src/routes/index.tsx
          </code>{' '}
          and save to reload.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto px-4">
          {demoRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block p-6 bg-inputs-background border border-inputs-border rounded-lg hover:border-divers-button hover:bg-inputs-background-off transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-inputs-title mb-2">
                {route.label}
              </h3>
              <p className="text-sm text-inputs-text">{route.path}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          <a
            className="text-divers-button hover:underline"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <br />
          <a
            className="text-divers-button hover:underline"
            href="https://tanstack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn TanStack
          </a>
        </div>
      </header>
    </div>
  )
}
