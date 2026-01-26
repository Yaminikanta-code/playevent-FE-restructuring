# Common Components

This directory contains reusable UI components for the Play Event application, including buttons and form components.

## Button Components

### Button

A versatile button component with multiple variants, sizes, and states.

#### Props

- `variant`: `'primary' | 'secondary' | 'destructive' | 'success' | 'outline' | 'ghost'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `icon`: `LucideIcon` - Optional icon component from lucide-react
- `iconPosition`: `'left' | 'right'` (default: `'left'`)
- `isLoading`: `boolean` - Shows loading spinner (default: `false`)
- `fullWidth`: `boolean` - Makes button full width (default: `false`)
- `disabled`: `boolean` - Disables the button (default: `false`)
- All standard HTML button attributes

#### Usage Examples

```tsx
import { Button } from '@/common'
import { Plus, Settings } from 'lucide-react'

// Basic button
<Button>Click me</Button>

// Different variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Success</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button icon={Plus} iconPosition="left">Add New</Button>
<Button icon={Settings} iconPosition="right">Settings</Button>

// Loading state
<Button isLoading>Loading...</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### IconButton

A button component that displays only an icon, perfect for toolbar buttons and actions.

#### Props

- `icon`: `LucideIcon` - Required icon component from lucide-react
- `variant`: `'primary' | 'secondary' | 'destructive' | 'success' | 'outline' | 'ghost'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `isLoading`: `boolean` - Shows loading spinner (default: `false`)
- `tooltip`: `string` - Optional tooltip text
- `disabled`: `boolean` - Disables the button (default: `false`)
- All standard HTML button attributes

#### Usage Examples

```tsx
import { IconButton } from '@/common'
import { Plus, Settings, Trash2, Search } from 'lucide-react'

// Basic icon button
<IconButton icon={Plus} />

// Different variants
<IconButton variant="primary" icon={Plus} />
<IconButton variant="secondary" icon={Settings} />
<IconButton variant="destructive" icon={Trash2} />
<IconButton variant="success" icon={Check} />
<IconButton variant="outline" icon={Search} />
<IconButton variant="ghost" icon={X} />

// Different sizes
<IconButton icon={Plus} size="sm" />
<IconButton icon={Plus} size="md" />
<IconButton icon={Plus} size="lg" />

// With tooltip
<IconButton icon={Settings} tooltip="Settings" />

// Loading state
<IconButton icon={Plus} isLoading />

// Disabled
<IconButton icon={Plus} disabled />
```

## Form Components

All form components are built with React Hook Form and provide seamless integration with form validation.

### Form

A wrapper component that provides React Hook Form context to all child form components.

#### Props

- `form`: `UseFormReturn<T>` - The form instance from `useForm()`
- `onSubmit`: `(data: T) => void | Promise<void>` - Form submission handler
- `children`: `React.ReactNode` - Form child components
- All standard HTML form attributes

#### Usage Examples

```tsx
import { Form } from '@/common'
import { useForm } from 'react-hook-form'

const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  },
})

const onSubmit = (data) => {
  console.log(data)
}

<Form form={form} onSubmit={onSubmit}>
  {/* Form fields go here */}
</Form>
```

### Input

A text input field with label, icon, error handling, and validation support.

#### Props

- `name`: `Path<T>` - Field name in form data
- `control`: `Control<T>` - React Hook Form control object
- `label`: `string` - Field label
- `placeholder`: `string` - Placeholder text
- `type`: `'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'` (default: `'text'`)
- `icon`: `LucideIcon` - Optional icon to display inside input
- `rules`: `object` - React Hook Form validation rules
- `error`: `string` - External error message
- `helperText`: `string` - Helper text displayed below input
- All standard HTML input attributes

#### Usage Examples

```tsx
import { Input } from '@/common'
import { Mail, Lock } from 'lucide-react'

// Basic input
<Input
  name="email"
  label="Email"
  placeholder="Enter your email"
  control={form.control}
  rules={{ required: 'Email is required' }}
/>

// With icon
<Input
  name="password"
  type="password"
  label="Password"
  placeholder="Enter your password"
  icon={Lock}
  control={form.control}
  rules={{ required: 'Password is required' }}
/>

// With validation
<Input
  name="email"
  type="email"
  label="Email"
  placeholder="john@example.com"
  icon={Mail}
  control={form.control}
  rules={{
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  }}
  helperText="We'll never share your email."
/>
```

### Select

A dropdown select field with options, label, error handling, and validation support.

#### Props

- `name`: `Path<T>` - Field name in form data
- `control`: `Control<T>` - React Hook Form control object
- `label`: `string` - Field label
- `placeholder`: `string` - Placeholder text (default: `'Select an option'`)
- `options`: `SelectOption[]` - Array of options with value and label
- `rules`: `object` - React Hook Form validation rules
- `error`: `string` - External error message
- `helperText`: `string` - Helper text displayed below select
- All standard HTML select attributes

#### Usage Examples

```tsx
import { Select } from '@/common'

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
]

<Select
  name="country"
  label="Country"
  placeholder="Select your country"
  control={form.control}
  options={countryOptions}
  rules={{ required: 'Country is required' }}
/>
```

### Checkbox

A checkbox field with label, error handling, and validation support.

#### Props

- `name`: `Path<T>` - Field name in form data
- `control`: `Control<T>` - React Hook Form control object
- `label`: `string` - Checkbox label
- `rules`: `object` - React Hook Form validation rules
- `error`: `string` - External error message
- `helperText`: `string` - Helper text displayed below checkbox
- All standard HTML input attributes

#### Usage Examples

```tsx
import { Checkbox } from '@/common'

<Checkbox
  name="terms"
  label="I agree to the Terms and Conditions"
  control={form.control}
  rules={{ required: 'You must agree to terms' }}
/>

<Checkbox
  name="newsletter"
  label="Subscribe to our newsletter"
  control={form.control}
  helperText="Get the latest updates."
/>
```

### Radio

A radio button group with options, label, error handling, and validation support.

#### Props

- `name`: `Path<T>` - Field name in form data
- `control`: `Control<T>` - React Hook Form control object
- `label`: `string` - Field label
- `options`: `RadioOption[]` - Array of options with value and label
- `orientation`: `'vertical' | 'horizontal'` (default: `'vertical'`)
- `rules`: `object` - React Hook Form validation rules
- `error`: `string` - External error message
- `helperText`: `string` - Helper text displayed below radio group
- All standard HTML input attributes

#### Usage Examples

```tsx
import { Radio } from '@/common'

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

<Radio
  name="gender"
  label="Gender"
  control={form.control}
  options={genderOptions}
  orientation="horizontal"
  rules={{ required: 'Gender is required' }}
/>
```

### Textarea

A multi-line text input field with label, error handling, and validation support.

#### Props

- `name`: `Path<T>` - Field name in form data
- `control`: `Control<T>` - React Hook Form control object
- `label`: `string` - Field label
- `placeholder`: `string` - Placeholder text
- `rows`: `number` - Number of visible rows (default: `4`)
- `resize`: `'none' | 'both' | 'horizontal' | 'vertical'` (default: `'vertical'`)
- `rules`: `object` - React Hook Form validation rules
- `error`: `string` - External error message
- `helperText`: `string` - Helper text displayed below textarea
- All standard HTML textarea attributes

#### Usage Examples

```tsx
import { Textarea } from '@/common'

<Textarea
  name="bio"
  label="About You"
  placeholder="Tell us about yourself..."
  rows={4}
  control={form.control}
  rules={{
    maxLength: {
      value: 500,
      message: 'Bio must be less than 500 characters',
    },
  }}
  helperText="Maximum 500 characters"
/>
```

## Complete Form Example

```tsx
import { Form, Input, Select, Checkbox, Radio, Textarea, Button } from '@/common'
import { useForm } from 'react-hook-form'
import { Mail, Lock } from 'lucide-react'

type FormData = {
  email: string
  password: string
  country: string
  terms: boolean
  gender: string
  bio: string
}

function MyForm() {
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      country: '',
      terms: false,
      gender: '',
      bio: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="john@example.com"
        icon={Mail}
        control={form.control}
        rules={{ required: 'Email is required' }}
      />

      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        icon={Lock}
        control={form.control}
        rules={{ required: 'Password is required' }}
      />

      <Select
        name="country"
        label="Country"
        placeholder="Select your country"
        control={form.control}
        options={[{ value: 'us', label: 'United States' }]}
      />

      <Radio
        name="gender"
        label="Gender"
        control={form.control}
        options={[{ value: 'male', label: 'Male' }]}
      />

      <Checkbox
        name="terms"
        label="I agree to the Terms and Conditions"
        control={form.control}
        rules={{ required: 'You must agree to terms' }}
      />

      <Textarea
        name="bio"
        label="About You"
        placeholder="Tell us about yourself..."
        control={form.control}
      />

      <Button type="submit">Submit</Button>
    </Form>
  )
}
```

## Styling

All components use CSS variables defined in `styles.css` for consistent theming:

- `--variable-collection-divers-button` (#7e77e8) - Primary button color
- `--variable-collection-ink-highlight` (#7e77e8) - Secondary button color
- `--variable-collection-ink-error` (#da3c3c) - Destructive/error color
- `--variable-collection-icons-green` (#34d399) - Success color
- `--variable-collection-inputs-border` (#1c303b) - Input border color
- `--variable-collection-inputs-background` (#020818) - Input background color
- `--variable-collection-inputs-title` (#ffffff) - Input text color
- `--variable-collection-inputs-text` (#b0afbd) - Input placeholder text color
- `--variable-collection-inputs-text-off` (#465361) - Input disabled text color

## Icons

All icons are imported from `lucide-react`. Visit [lucide.dev](https://lucide.dev/) for available icons.

## Testing

To see all button components in action, visit the `/test` route in your application.

To see all form components in action, visit the `/form-test` route in your application.

## Accessibility

- All buttons have proper focus states with ring indicators
- Loading states disable user interaction
- Icon buttons support tooltips for better UX
- All buttons support keyboard navigation
- All form fields have proper labels and error states
- Form validation provides clear error messages
- All interactive elements are keyboard accessible
