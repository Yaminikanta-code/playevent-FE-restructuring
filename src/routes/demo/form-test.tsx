import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import {
  Form,
  Input,
  ColorInput,
  Select,
  Checkbox,
  Radio,
  Textarea,
  Button,
  StatusSelector,
  DatePicker,
  TimePicker,
  DateTimePicker,
} from '../../common'
import { Mail, Lock, User, Phone } from 'lucide-react'

export const Route = createFileRoute('/demo/form-test')({
  component: RouteComponent,
})

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  country: string
  status: string
  terms: boolean
  newsletter: boolean
  gender: string
  bio: string
  birthDate: string
  meetingTime: string
  eventDateTime: string
  favoriteColor: string
}

function RouteComponent() {
  const form = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      country: '',
      status: '',
      terms: false,
      newsletter: false,
      gender: '',
      bio: '',
      birthDate: '',
      meetingTime: '',
      eventDateTime: '',
      favoriteColor: '#7e77e8',
    },
  })

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data)
    alert('Form submitted! Check console for data.')
  }

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
  ]

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not', label: 'Prefer not to say' },
  ]

  return (
    <div className="p-8 bg-inputs-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-inputs-title mb-8">
          Form Components
        </h1>

        <Form form={form} onSubmit={onSubmit} className="space-y-6">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="firstName"
              label="First Name"
              placeholder="John"
              control={form.control}
              icon={User}
              rules={{ required: 'First name is required' }}
            />
            <Input
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              control={form.control}
              rules={{ required: 'Last name is required' }}
            />
          </div>

          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            control={form.control}
            icon={Mail}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            helperText="We'll never share your email with anyone else."
          />

          <Input
            name="phone"
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            control={form.control}
            icon={Phone}
            rules={{
              pattern: {
                value: /^\+?[\d\s-()]+$/,
                message: 'Invalid phone number',
              },
            }}
          />

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            control={form.control}
            icon={Lock}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
          />

          {/* Select Field */}
          <Select
            name="country"
            label="Country"
            placeholder="Select your country"
            control={form.control}
            options={countryOptions}
            rules={{ required: 'Country is required' }}
          />

          {/* Status Selector */}
          <StatusSelector
            name="status"
            label="Status"
            control={form.control}
            rules={{ required: 'Status is required' }}
            // helperText="Select your current status"
          />

          {/* Radio Buttons */}
          <Radio
            name="gender"
            label="Gender"
            control={form.control}
            options={genderOptions}
            orientation="horizontal"
            rules={{ required: 'Gender is required' }}
          />

          {/* Checkboxes */}
          <div className="space-y-4">
            <Checkbox
              name="terms"
              label="I agree to the Terms and Conditions"
              control={form.control}
              rules={{
                required: 'You must agree to the terms',
              }}
            />
            <Checkbox
              name="newsletter"
              label="Subscribe to our newsletter"
              control={form.control}
              helperText="Get the latest updates and offers."
            />
          </div>

          {/* Textarea */}
          <Textarea
            name="bio"
            label="About You"
            placeholder="Tell us a little about yourself..."
            control={form.control}
            rows={4}
            rules={{
              maxLength: {
                value: 500,
                message: 'Bio must be less than 500 characters',
              },
            }}
            helperText="Maximum 500 characters"
          />

          {/* Color Input */}
          <ColorInput
            name="favoriteColor"
            label="Favorite Color"
            placeholder="#000000FF"
            control={form.control}
            rules={{
              pattern: {
                value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/,
                message:
                  'Please enter a valid hex/hexa color (e.g., #FF0000 or #FF0000FF)',
              },
            }}
            helperText="Click the color dot to pick a color"
            dotSize={24}
          />

          {/* Date and Time Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DatePicker
              name="birthDate"
              label="Birth Date"
              control={form.control}
              rules={{ required: 'Birth date is required' }}
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
              helperText="Select your date of birth"
            />
            <TimePicker
              name="meetingTime"
              label="Meeting Time"
              control={form.control}
              rules={{ required: 'Meeting time is required' }}
              step="900"
              helperText="Select time in 15-minute intervals"
            />
            <DateTimePicker
              name="eventDateTime"
              label="Event Date & Time"
              control={form.control}
              rules={{ required: 'Event date and time is required' }}
              min={new Date().toISOString().slice(0, 16)}
              helperText="Select future date and time"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" variant="primary" size="lg">
              Submit Form
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
