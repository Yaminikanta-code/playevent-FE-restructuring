import { createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Form, Input, Button, Card } from '../../components/common'
import { useLogin } from '../../api/auth.api'
import { useAlertStore } from '../../stores/useAlertStore'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/useAuthStore'

type LoginFormData = {
  email: string
  password: string
}

export const Route = createFileRoute('/admin/login')({
  // Redirect authenticated users BEFORE the component renders
  beforeLoad: () => {
    const { access_token } = useAuthStore.getState()
    if (access_token) {
      throw redirect({ to: '/admin/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useLogin()
  const showAlert = useAlertStore((state) => state.showAlert)

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    // Ensure data matches LoginCredentials interface
    const credentials = {
      email: data.email,
      password: data.password,
    }

    login(credentials, {
      onSuccess: () => {
        showAlert({
          message: 'Login successful!',
          type: 'success',
        })
        navigate({ to: '/admin/dashboard' })
      },
      onError: (error: any) => {
        // Error handling is already done in the useLogin hook
        console.error('Login error:', error)
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* <div className="text-center">
          <h1 className="text-4xl font-bold text-primary bg-clip-text text-transparent">
            Play Event
          </h1>
          <p className="text-muted-foreground mt-2">Admin Back Office Login</p>
        </div> */}

        <Card>
          <div className="space-y-1 mb-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary bg-clip-text text-transparent">
                Play Event
              </h1>
              <p className="text-muted-foreground mt-2">
                Admin Back Office Login
              </p>
            </div>
          </div>

          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="admin@playevent.com"
              control={form.control}
              rules={{ required: 'Email is required' }}
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              control={form.control}
              rules={{ required: 'Password is required' }}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  )
}
