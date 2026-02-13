import { createFileRoute, useNavigate } from '@tanstack/react-router'
import FontForm from '../../../../components/admin/fonts/FontForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/settings/fonts/new')({
  beforeLoad: authRedirect,
  component: FontNewPage,
})

function FontNewPage() {
  const navigate = useNavigate()

  return (
    <div className="relative">
      <FontForm
        font={null}
        mode="new"
        onClose={() => navigate({ to: '/admin/settings' })}
      />
    </div>
  )
}
