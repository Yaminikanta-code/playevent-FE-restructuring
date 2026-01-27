import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Copy,
  ChevronDown,
} from 'lucide-react'
import { cn } from '../lib/utils'

export type SortDirection = 'asc' | 'desc' | null

export interface Column<T> {
  key: string
  title: string
  icon?: React.ElementType
  width?: string
  sortable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface Action<T> {
  icon?: React.ElementType
  label: string
  onClick: (row: T, index: number) => void
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  disabled?: (row: T) => boolean
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchableFields?: (keyof T)[]
  pagination?: boolean
  pageSize?: number
  emptyMessage?: string
  loading?: boolean
  className?: string
  onRowClick?: (row: T, index: number) => void
  onSort?: (column: Column<T>, direction: SortDirection) => void
  defaultSortColumn?: string
  defaultSortDirection?: SortDirection
}

function Table<T>({
  data,
  columns,
  actions,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchableFields,
  pagination = false,
  pageSize = 10,
  emptyMessage = 'No data available',
  loading = false,
  className,
  onRowClick,
  onSort,
  defaultSortColumn,
  defaultSortDirection = null,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(
    defaultSortColumn || null,
  )
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection)

  /* ---------------- FILTER ---------------- */
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchableFields) return data
    const query = searchQuery.toLowerCase()

    return data.filter((row) =>
      searchableFields.some((field) => {
        const value = row[field]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(query)
      }),
    )
  }, [data, searchQuery, searchableFields])

  /* ---------------- SORT ---------------- */
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortColumn]
      const bValue = (b as any)[sortColumn]

      if (aValue === bValue) return 0
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  /* ---------------- PAGINATION ---------------- */
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData

    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, pagination, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  /* ---------------- SORT HANDLER ---------------- */
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return

    let newDirection: SortDirection = 'asc'

    if (sortColumn === column.key) {
      if (sortDirection === 'asc') newDirection = 'desc'
      else if (sortDirection === 'desc') newDirection = null
    }

    setSortColumn(newDirection ? column.key : null)
    setSortDirection(newDirection)
    onSort?.(column, newDirection)
  }

  /* ---------------- COLUMN WIDTH MATCH ---------------- */
  const getColumnStyle = (column: Column<T>, isFirst: boolean) => {
    if (column.width) return { width: column.width, flexShrink: 0 }

    // Client column small
    if (column.key.toLowerCase().includes('client')) {
      return { width: '140px', flexShrink: 0 }
    }

    // Members column fixed + centered
    if (column.key.toLowerCase().includes('member')) {
      return { width: '140px', flexShrink: 0 }
    }

    // Team name expands
    if (isFirst) return { flex: 1, minWidth: 0 }

    return { flex: 1, minWidth: 0 }
  }

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'justify-center text-center'
    if (align === 'right') return 'justify-end text-right'
    return 'justify-start text-left'
  }

  /* ---------------- CELL RENDER ---------------- */
  const renderCell = (
    column: Column<T>,
    row: T,
    index: number,
  ): React.ReactNode => {
    const value = row[column.key as keyof T]
    return column.render
      ? column.render(value, row, index)
      : String(value ?? '-')
  }

  return (
    <div className={cn('w-full', className)}>
      {/* ---------------- SEARCH ---------------- */}
      {searchable && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-inputs-text" />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-inputs-background border border-white/10 text-inputs-title placeholder:text-inputs-text focus:outline-none focus:ring-2 focus:ring-divers-button"
            />
          </div>
        </div>
      )}

      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center gap-6 px-6 pb-3 text-sm text-inputs-text font-medium">
        {columns.map((column, index) => (
          <div
            key={column.key}
            style={getColumnStyle(column, index === 0)}
            className={cn(
              'flex items-center gap-2 select-none',
              column.sortable && 'cursor-pointer',
              getAlignmentClass(column.align),
            )}
            onClick={() => handleSort(column)}
          >
            {column.icon && <column.icon className="h-4 w-4" />}
            <span className="truncate">{column.title}</span>

            {column.sortable && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  sortColumn === column.key &&
                    sortDirection === 'asc' &&
                    'rotate-180',
                  sortColumn !== column.key && 'opacity-30',
                )}
              />
            )}
          </div>
        ))}

        {/* Actions spacer */}
        {actions?.length && <div style={{ width: '90px', flexShrink: 0 }} />}
      </div>

      {/* ---------------- ROWS ---------------- */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-10 text-inputs-text">Loading...</div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-10 text-inputs-text">
            {emptyMessage}
          </div>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              onClick={() => onRowClick?.(row, rowIndex)}
              className={cn(
                'flex items-center gap-6 px-6 py-1 rounded-2xl',
                'bg-midnight-light border border-white/5',
                'shadow-sm transition-all duration-200',
                'hover:bg-midnight-light hover:shadow-md',
                onRowClick && 'cursor-pointer',
              )}
            >
              {columns.map((column, colIndex) => (
                <div
                  key={column.key}
                  style={getColumnStyle(column, colIndex === 0)}
                  className={cn(
                    'text-sm text-inputs-title flex items-center',
                    getAlignmentClass(column.align),
                  )}
                >
                  <span className="truncate">
                    {renderCell(column, row, rowIndex)}
                  </span>
                </div>
              ))}

              {/* ---------------- ACTIONS ---------------- */}
              {actions?.length && (
                <div className="flex items-center justify-end gap-4 w-[90px] flex-shrink-0">
                  {actions.map((action, i) => {
                    const Icon = action.icon || Copy
                    const disabled = action.disabled?.(row) ?? false

                    return (
                      <button
                        key={i}
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!disabled) action.onClick(row, rowIndex)
                        }}
                        className={cn(
                          'p-2 rounded-lg transition',
                          disabled && 'opacity-40 cursor-not-allowed',
                          action.variant === 'destructive'
                            ? 'text-red-500 hover:bg-red-500/10'
                            : 'text-white/80 hover:text-white hover:bg-white/5',
                        )}
                        title={action.label}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      {pagination && totalPages > 1 && (
        <div className="mt-8 flex justify-end items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button className="px-4 py-2 rounded-xl bg-divers-button text-white font-medium">
            {currentPage}
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Table
