import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useFontById } from '../../../../api/font.api'
import FontForm from '../../../../components/admin/fonts/FontForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/settings/fonts/$fontId')({
  beforeLoad: authRedirect,
  component: FontEditPage,
})

function FontEditPage() {
  const { fontId } = Route.useParams()
  const navigate = useNavigate()

  const { data: font, isLoading } = useFontById(fontId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    )
  }

  if (!font) {
    return (
      <div className="flex items-center justify-center h-64">
        Font not found
      </div>
    )
  }

  return (
    <div className="relative">
      <FontForm
        font={font}
        mode="edit"
        onClose={() => navigate({ to: '/admin/settings' })}
      />
    </div>
  )
}
