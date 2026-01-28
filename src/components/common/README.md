# Common Components

This directory contains reusable UI components for the Play Event application, including buttons, form components, layout components, and data display components.

## Table of Contents

- [Button Components](#button-components)
  - [Button](#button)
  - [IconButton](#iconbutton)
- [Form Components](#form-components)
  - [Form](#form)
  - [Input](#input)
  - [Select](#select)
  - [Checkbox](#checkbox)
  - [Radio](#radio)
  - [Textarea](#textarea)
  - [DatePicker](#datepicker)
  - [TimePicker](#timepicker)
  - [DateTimePicker](#datetimepicker)
  - [ColorInput](#colorinput)
  - [StatusSelector](#statusselector)
- [Modal Components](#modal-components)
  - [Modal](#modal)
  - [ConfirmationModal](#confirmationmodal)
  - [FormModal](#formmodal)
- [Layout Components](#layout-components)
  - [Collapsible](#collapsible)
  - [ScrollArea](#scrollarea)
- [Data Display Components](#data-display-components)
  - [Table](#table)
  - [StatusBadge](#statusbadge)
- [Menu Components](#menu-components)
  - [ContextMenu](#contextmenu)

---

## Button Components

### Button

A versatile button component with multiple variants, sizes, and states.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'success' \| 'outline' \| 'ghost'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `icon` | `LucideIcon` | - | Optional icon component |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon placement |
| `isLoading` | `boolean` | `false` | Shows loading spinner |
| `fullWidth` | `boolean` | `false` | Makes button full width |
| `disabled` | `boolean` | `false` | Disables the button |

#### Usage

```tsx
import { Button } from '../common'
import { Plus, Settings } from 'lucide-react'

// Basic variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Success</Button>

// With icons
<Button icon={Plus} iconPosition="left">Add New</Button>
<Button icon={Settings} iconPosition="right">Settings</Button>

// States
<Button isLoading>Loading...</Button>
<Button fullWidth>Full Width</Button>
<Button disabled>Disabled</Button>
```

---

### IconButton

A button component that displays only an icon, perfect for toolbar buttons and actions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | Required | Icon component from lucide-react |
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'success' \| 'outline' \| 'ghost'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Shows loading spinner |
| `tooltip` | `string` | - | Tooltip text on hover |

#### Usage

```tsx
import { IconButton } from '../common'
import { Plus, Trash2, Settings } from 'lucide-react'

<IconButton icon={Plus} tooltip="Add" />
<IconButton icon={Trash2} variant="destructive" tooltip="Delete" />
<IconButton icon={Settings} size="lg" isLoading />
```

---

## Form Components

All form components integrate with React Hook Form for validation and state management.

### Form

A wrapper component that provides React Hook Form context.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `form` | `UseFormReturn<T>` | Form instance from `useForm()` |
| `onSubmit` | `(data: T) => void \| Promise<void>` | Form submission handler |
| `children` | `React.ReactNode` | Form child components |

#### Usage

```tsx
import { Form } from '../common'
import { useForm } from 'react-hook-form'

const form = useForm({ defaultValues: { email: '' } })

<Form form={form} onSubmit={(data) => console.log(data)}>
  {/* Form fields */}
</Form>
```

---

### Input

A text input field with label, icon, error handling, and validation support.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Path<T>` | Required | Field name in form data |
| `control` | `Control<T>` | Required | React Hook Form control |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | `''` | Placeholder text |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | Input type |
| `icon` | `LucideIcon` | - | Icon inside input |
| `rules` | `object` | - | Validation rules |
| `error` | `string` | - | External error message |
| `helperText` | `string` | - | Helper text below input |

#### Usage

```tsx
import { Input } from '../common'
import { Mail } from 'lucide-react'

<Input
  name="email"
  type="email"
  label="Email"
  placeholder="john@example.com"
  icon={Mail}
  control={form.control}
  rules={{ required: 'Email is required' }}
/>
```

---

### Select

A dropdown select field with custom styling.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Path<T>` | Required | Field name |
| `control` | `Control<T>` | Required | React Hook Form control |
| `label` | `string` | - | Field label |
| `placeholder` | `string` | `'Select an option'` | Placeholder |
| `options` | `SelectOption[]` | Required | Array of `{ value, label }` |
| `triggerClassName` | `string` | - | Custom trigger button styling |
| `rules` | `object` | - | Validation rules |

#### Usage

```tsx
import { Select } from '../common'

const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
]

<Select
  name="country"
  label="Country"
  control={form.control}
  options={options}
  rules={{ required: 'Country is required' }}
/>
```

---

### Checkbox

A checkbox field with label and validation support.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `Path<T>` | Field name |
| `control` | `Control<T>` | React Hook Form control |
| `label` | `string` | Checkbox label |
| `rules` | `object` | Validation rules |
| `helperText` | `string` | Helper text |

#### Usage

```tsx
import { Checkbox } from '../common'

<Checkbox
  name="terms"
  label="I agree to the Terms and Conditions"
  control={form.control}
  rules={{ required: 'You must agree' }}
/>
```

---

### Radio

A radio button group with options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Path<T>` | Required | Field name |
| `control` | `Control<T>` | Required | React Hook Form control |
| `label` | `string` | - | Field label |
| `options` | `RadioOption[]` | Required | Array of `{ value, label }` |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |

#### Usage

```tsx
import { Radio } from '../common'

<Radio
  name="gender"
  label="Gender"
  control={form.control}
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]}
  orientation="horizontal"
/>
```

---

### Textarea

A multi-line text input field.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Path<T>` | Required | Field name |
| `control` | `Control<T>` | Required | React Hook Form control |
| `label` | `string` | - | Field label |
| `rows` | `number` | `4` | Number of visible rows |
| `resize` | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | `'vertical'` | Resize behavior |

#### Usage

```tsx
import { Textarea } from '../common'

<Textarea
  name="bio"
  label="About You"
  placeholder="Tell us about yourself..."
  rows={4}
  control={form.control}
/>
```

---

### DatePicker

A date input field with native browser date picker.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `Path<T>` | Field name |
| `control` | `Control<T>` | React Hook Form control |
| `label` | `string` | Field label |
| `min` | `string` | Minimum date (YYYY-MM-DD) |
| `max` | `string` | Maximum date (YYYY-MM-DD) |

#### Usage

```tsx
import { DatePicker } from '../common'

<DatePicker
  name="birthDate"
  label="Birth Date"
  control={form.control}
  min="1900-01-01"
  max="2024-12-31"
/>
```

---

### TimePicker

A time input field with native browser time picker.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `Path<T>` | Field name |
| `control` | `Control<T>` | React Hook Form control |
| `label` | `string` | Field label |
| `step` | `string \| number` | Time step in seconds |

#### Usage

```tsx
import { TimePicker } from '../common'

<TimePicker
  name="meetingTime"
  label="Meeting Time"
  control={form.control}
  step="900" // 15-minute intervals
/>
```

---

### DateTimePicker

A combined date and time input field.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `Path<T>` | Field name |
| `control` | `Control<T>` | React Hook Form control |
| `label` | `string` | Field label |
| `min` | `string` | Minimum datetime (YYYY-MM-DDTHH:MM) |
| `max` | `string` | Maximum datetime |

#### Usage

```tsx
import { DateTimePicker } from '../common'

<DateTimePicker
  name="eventDateTime"
  label="Event Date & Time"
  control={form.control}
/>
```

---

### ColorInput

A color picker input with hex and opacity support.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Path<T>` | Required | Field name |
| `control` | `Control<T>` | Required | React Hook Form control |
| `label` | `string` | - | Field label |
| `placeholder` | `string` | `'#000000FF'` | Placeholder text |
| `dotSize` | `number` | `20` | Size of the color preview dot |
| `showOpacity` | `boolean` | `true` | Show opacity slider |

#### Usage

```tsx
import { ColorInput } from '../common'

<ColorInput
  name="primaryColor"
  label="Primary Color"
  control={form.control}
  dotSize={24}
/>
```

---

### StatusSelector

A specialized select for status values with colored backgrounds.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `Path<T>` | Required | Field name |
| `control` | `Control<T>` | Required | React Hook Form control |
| `label` | `string` | - | Field label |
| `options` | `StatusOption[]` | Default statuses | Custom status options |

#### Built-in Statuses

- `available` - Green
- `busy` - Orange
- `away` - Purple
- `offline` - Dark
- `alert` - Orange
- `success` - Green
- `neutral` - Purple

#### Usage

```tsx
import { StatusSelector } from '../common'

<StatusSelector
  name="status"
  label="Status"
  control={form.control}
/>
```

---

## Modal Components

### Modal

A base modal component with focus management and keyboard support.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Modal visibility |
| `onClose` | `() => void` | Required | Close handler |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `showHeader` | `boolean` | `true` | Show header |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |

#### Usage

```tsx
import { Modal } from '../common'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
  <p>Modal content here</p>
</Modal>
```

---

### ConfirmationModal

A pre-styled modal for confirmation dialogs.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Modal visibility |
| `onClose` | `() => void` | Required | Close handler |
| `title` | `string` | `'Confirm Action'` | Modal title |
| `message` | `string` | Required | Confirmation message |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `onConfirm` | `() => void` | Required | Confirm handler |
| `variant` | `'danger' \| 'warning' \| 'info'` | `'danger'` | Style variant |

#### Usage

```tsx
import { ConfirmationModal } from '../common'

<ConfirmationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  onConfirm={handleDelete}
  variant="danger"
/>
```

---

### FormModal

A modal pre-configured for forms with submit/cancel actions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Modal visibility |
| `onClose` | `() => void` | Required | Close handler |
| `title` | `string` | Required | Modal title |
| `description` | `string` | - | Description text |
| `submitText` | `string` | `'Submit'` | Submit button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `onSubmit` | `(e: FormEvent) => void` | Required | Form submit handler |
| `isSubmitting` | `boolean` | `false` | Loading state |
| `submitDisabled` | `boolean` | `false` | Disable submit |
| `footerActions` | `React.ReactNode` | - | Custom footer actions |

#### Usage

```tsx
import { FormModal, Input } from '../common'

<FormModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Item"
  onSubmit={handleSubmit}
  isSubmitting={isLoading}
>
  <Input name="name" label="Name" control={form.control} />
</FormModal>
```

---

## Layout Components

### Collapsible

An expandable/collapsible section with smooth animations.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Header title |
| `actions` | `React.ReactNode[]` | `[]` | Action buttons (max 4) |
| `defaultExpanded` | `boolean` | `false` | Initially expanded |
| `expanded` | `boolean` | - | Controlled expanded state |
| `onExpandedChange` | `(expanded: boolean) => void` | - | State change callback |

#### Usage

```tsx
import { Collapsible, IconButton } from '../common'
import { Edit, Trash2 } from 'lucide-react'

<Collapsible
  title="Settings"
  defaultExpanded={true}
  actions={[
    <IconButton key="edit" icon={Edit} size="sm" />,
    <IconButton key="delete" icon={Trash2} size="sm" />,
  ]}
>
  <p>Collapsible content here</p>
</Collapsible>
```

---

### ScrollArea

A scrollable container with a fixed header area.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Header title |
| `headerActions` | `React.ReactNode` | - | Actions on the right of title |
| `headerContent` | `React.ReactNode` | - | Content below header (tabs, etc.) |
| `maxHeight` | `string \| number` | - | Maximum height |
| `contentClassName` | `string` | - | Classes for content area |

#### Usage

```tsx
import { ScrollArea, IconButton } from '../common'
import { Save } from 'lucide-react'

<ScrollArea
  title="New Event"
  maxHeight={500}
  headerActions={<IconButton icon={Save} />}
  headerContent={<TabBar />}
>
  <div>Scrollable content here</div>
</ScrollArea>
```

---

## Data Display Components

### Table

A feature-rich data table with sorting, search, pagination, and row actions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | Required | Array of data objects |
| `columns` | `Column<T>[]` | Required | Column definitions |
| `actions` | `Action<T>[]` | - | Row action buttons |
| `searchable` | `boolean` | `false` | Enable search |
| `searchPlaceholder` | `string` | `'Search...'` | Search placeholder |
| `searchableFields` | `(keyof T)[]` | - | Fields to search |
| `pagination` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Items per page |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `loading` | `boolean` | `false` | Loading state |
| `onRowClick` | `(row: T, index: number) => void` | - | Row click handler |
| `onSort` | `(column, direction) => void` | - | Sort handler |
| `defaultSortColumn` | `string` | - | Initial sort column |
| `defaultSortDirection` | `'asc' \| 'desc' \| null` | `null` | Initial sort direction |

#### Column Definition

```tsx
interface Column<T> {
  key: string
  title: string
  icon?: React.ElementType
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
}
```

#### Action Definition

```tsx
interface Action<T> {
  icon?: React.ElementType
  label: string
  onClick: (row: T, index: number) => void
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  disabled?: (row: T) => boolean
}
```

#### Usage

```tsx
import { Table } from '../common'
import { Edit, Trash2 } from 'lucide-react'

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email' },
  { key: 'status', title: 'Status', align: 'center' },
]

const actions = [
  { icon: Edit, label: 'Edit', onClick: (row) => editItem(row) },
  { icon: Trash2, label: 'Delete', onClick: (row) => deleteItem(row), variant: 'destructive' },
]

<Table
  data={users}
  columns={columns}
  actions={actions}
  searchable
  searchableFields={['name', 'email']}
  pagination
  pageSize={10}
  onRowClick={(row) => console.log(row)}
/>
```

---

### StatusBadge

A styled badge for displaying status indicators.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `BadgeStatusType` | Required | Status type |
| `label` | `string` | - | Custom label (overrides default) |
| `className` | `string` | - | Additional classes |

#### Status Types

| Status | Background | Text | Default Label |
|--------|------------|------|---------------|
| `active` | Light green | Green | Active |
| `inactive` | Light gray | Gray | Inactive |
| `pending` | Orange | White | Pending |
| `success` | Light green | Dark green | Success |
| `warning` | Light orange | Dark orange | Warning |
| `error` | Dark red | White | Error |
| `info` | Light purple | Purple | Info |

#### Usage

```tsx
import { StatusBadge } from '../common'

<StatusBadge status="active" />
<StatusBadge status="error" label="Failed" />
<StatusBadge status="pending" />
```

---

## Menu Components

### ContextMenu

A dropdown menu triggered by clicking an element.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ContextMenuItem[]` | Required | Menu items |
| `trigger` | `React.ReactNode` | Required | Trigger element |
| `position` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | `'bottom-left'` | Menu position |
| `offset` | `number` | `8` | Offset from trigger |
| `onOpen` | `() => void` | - | Open callback |
| `onClose` | `() => void` | - | Close callback |

#### Menu Item Definition

```tsx
interface ContextMenuItem {
  icon?: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}
```

#### Usage

```tsx
import { ContextMenu, IconButton } from '../common'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'

<ContextMenu
  trigger={<IconButton icon={MoreHorizontal} />}
  items={[
    { icon: Edit, label: 'Edit', onClick: () => handleEdit() },
    { icon: Trash2, label: 'Delete', onClick: () => handleDelete(), destructive: true },
  ]}
  position="bottom-right"
/>
```

---

## Styling

All components use CSS variables defined in `styles.css`:

| Variable | Color | Usage |
|----------|-------|-------|
| `--variable-collection-divers-button` | #7e77e8 | Primary buttons |
| `--variable-collection-ink-error` | #da3c3c | Errors, destructive actions |
| `--variable-collection-icons-green` | #34d399 | Success states |
| `--variable-collection-inputs-border` | #1c303b | Input borders |
| `--variable-collection-inputs-background` | #020818 | Input backgrounds |
| `--variable-collection-inputs-title` | #ffffff | Input text |
| `--variable-collection-inputs-text` | #b0afbd | Placeholder text |

## Icons

All icons are from `lucide-react`. Visit [lucide.dev](https://lucide.dev/) for the full icon library.

## Demo Pages

| Route | Components |
|-------|------------|
| `/test` | Button, IconButton |
| `/form-test` | All form components |
| `/modal-test` | Modal, ConfirmationModal, FormModal |
| `/table-demo` | Table |
| `/collapsible-demo` | Collapsible |
| `/context-menu-demo` | ContextMenu |
| `/scroll-area-demo` | ScrollArea |
