import { createFileRoute } from '@tanstack/react-router'
import ModulesForm from '../../../../components/admin/modules/ModulesForm'
import { authRedirect } from '@/lib/authRedirect'

export const Route = createFileRoute('/admin/settings/modules/')({
  beforeLoad: authRedirect,
  component: ModulesPage,
})

function ModulesPage() {
  return <ModulesForm />
}
