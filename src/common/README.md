# Button Components

This directory contains reusable button components for the Play Event application.

## Components

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

## Styling

All components use CSS variables defined in `styles.css` for consistent theming:

- `--variable-collection-divers-button` (#7e77e8) - Primary button color
- `--variable-collection-ink-highlight` (#7e77e8) - Secondary button color
- `--variable-collection-ink-error` (#da3c3c) - Destructive button color
- `--variable-collection-icons-green` (#34d399) - Success button color
- `--variable-collection-inputs-border` (#1c303b) - Border color
- `--variable-collection-inputs-background` (#020818) - Background color
- `--variable-collection-inputs-title` (#ffffff) - Text color

## Icons

All icons are imported from `lucide-react`. Visit [lucide.dev](https://lucide.dev/) for available icons.

## Testing

To see all button components in action, visit the `/test` route in your application.

## Accessibility

- All buttons have proper focus states with ring indicators
- Loading states disable user interaction
- Icon buttons support tooltips for better UX
- All buttons support keyboard navigation
