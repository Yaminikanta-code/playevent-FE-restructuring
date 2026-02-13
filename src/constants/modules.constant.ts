export interface Module {
  id: string
  name: string
  icon: string
  is_active: boolean
}

export const MOCK_MODULES: Module[] = [
  { id: '1', name: 'Analytics', icon: 'BarChart3', is_active: true },
  { id: '2', name: 'Games', icon: 'Gamepad2', is_active: true },
  { id: '3', name: 'Puzzles', icon: 'Puzzle', is_active: false },
  { id: '4', name: 'Brain Games', icon: 'Brain', is_active: true },
  { id: '5', name: 'Grid Games', icon: 'Grid3x3', is_active: false },
  { id: '6', name: 'Lists', icon: 'List', is_active: true },
]

export const MODULE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', disabled: false },
  { value: 'active', label: 'Active', disabled: false },
  { value: 'inactive', label: 'Inactive', disabled: false },
  { value: 'archived', label: 'Archived', disabled: false },
]

export const MODULE_DEFAULT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', disabled: false },
  { value: 'inactive', label: 'Inactive', disabled: false },
]
