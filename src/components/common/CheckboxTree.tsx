import { useMemo, useState, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface CheckboxTreeItem {
  id: string
  label: string
  parentId?: string
}

export interface CheckboxTreeProps<T extends FieldValues = FieldValues> {
  id?: string
  label?: string
  className?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  error?: string
  helperText?: string
  items: CheckboxTreeItem[]
  defaultExpandAll?: boolean
}

interface TreeNode {
  id: string
  label: string
  parentId?: string
  children: TreeNode[]
}

function buildTree(items: CheckboxTreeItem[]): {
  roots: TreeNode[]
  descendantsMap: Map<string, string[]>
} {
  const nodeMap = new Map<string, TreeNode>()

  for (const item of items) {
    nodeMap.set(item.id, { id: item.id, label: item.label, parentId: item.parentId, children: [] })
  }

  const roots: TreeNode[] = []

  for (const item of items) {
    const node = nodeMap.get(item.id)!
    if (item.parentId && nodeMap.has(item.parentId)) {
      nodeMap.get(item.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  const descendantsMap = new Map<string, string[]>()
  function collectDescendants(node: TreeNode): string[] {
    const desc: string[] = []
    for (const child of node.children) {
      desc.push(child.id)
      desc.push(...collectDescendants(child))
    }
    descendantsMap.set(node.id, desc)
    return desc
  }
  for (const root of roots) {
    collectDescendants(root)
  }

  return { roots, descendantsMap }
}

function toggleNode(
  nodeId: string,
  currentValue: string[],
  descendantsMap: Map<string, string[]>,
): string[] {
  const valueSet = new Set(currentValue)
  const isChecked = valueSet.has(nodeId)
  const descendants = descendantsMap.get(nodeId) || []

  if (isChecked) {
    // Uncheck this node and all descendants
    valueSet.delete(nodeId)
    for (const d of descendants) {
      valueSet.delete(d)
    }
  } else {
    // Check this node and all descendants
    valueSet.add(nodeId)
    for (const d of descendants) {
      valueSet.add(d)
    }
  }

  // No bubble-up: parents are never auto-checked/unchecked

  return Array.from(valueSet)
}

interface TreeNodeRowProps {
  node: TreeNode
  depth: number
  valueSet: Set<string>
  expandedSet: Set<string>
  descendantsMap: Map<string, string[]>
  onToggle: (nodeId: string) => void
  onToggleExpand: (nodeId: string) => void
}

const TreeNodeRow = ({
  node,
  depth,
  valueSet,
  expandedSet,
  descendantsMap,
  onToggle,
  onToggleExpand,
}: TreeNodeRowProps) => {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedSet.has(node.id)
  const isChecked = valueSet.has(node.id)

  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-1"
        style={{ paddingLeft: depth * 24 }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center text-inputs-text hover:text-inputs-title"
            onClick={() => onToggleExpand(node.id)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <button
          type="button"
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
            isChecked
              ? 'border-divers-button bg-divers-button'
              : 'border-inputs-border bg-inputs-background',
          )}
          onClick={() => onToggle(node.id)}
        >
          {isChecked && (
            <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
          )}
        </button>
        <span
          className="text-sm font-medium text-inputs-title cursor-pointer select-none"
          onClick={() => onToggle(node.id)}
        >
          {node.label}
        </span>
      </div>
      {hasChildren && isExpanded &&
        node.children.map((child) => (
          <TreeNodeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            valueSet={valueSet}
            expandedSet={expandedSet}
            descendantsMap={descendantsMap}
            onToggle={onToggle}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </div>
  )
}

const CheckboxTree = <T extends FieldValues = FieldValues>({
  id,
  label = '',
  className = '',
  control,
  name,
  rules = {},
  error: externalError,
  helperText,
  items,
  defaultExpandAll = false,
}: CheckboxTreeProps<T>) => {
  const treeId = id || name

  const { roots, descendantsMap } = useMemo(
    () => buildTree(items),
    [items],
  )

  const [expandedSet, setExpandedSet] = useState<Set<string>>(() => {
    if (defaultExpandAll) {
      return new Set(
        items.filter((i) => items.some((c) => c.parentId === i.id)).map((i) => i.id),
      )
    }
    return new Set<string>()
  })

  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedSet((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  const isRequired = rules && typeof rules === 'object' && 'required' in rules

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = fieldState.error || externalError
        const errorMessage = fieldState.error?.message || externalError
        const value: string[] = field.value || []
        const valueSet = new Set(value)

        const handleToggle = (nodeId: string) => {
          const newValue = toggleNode(nodeId, value, descendantsMap)
          field.onChange(newValue)
        }

        return (
          <div className={cn('flex flex-col', className)}>
            {label && (
              <label
                htmlFor={treeId}
                className="block text-sm font-medium text-inputs-title mb-2"
              >
                {label}
                {isRequired && <span className="text-ink-error ml-1">*</span>}
              </label>
            )}
            <div
              className={cn(
                'rounded-md border-2 p-3',
                hasError
                  ? 'border-ink-error'
                  : 'border-inputs-border',
                'bg-inputs-background',
              )}
            >
              {roots.map((root) => (
                <TreeNodeRow
                  key={root.id}
                  node={root}
                  depth={0}
                  valueSet={valueSet}
                  expandedSet={expandedSet}
                  descendantsMap={descendantsMap}
                  onToggle={handleToggle}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </div>
            {hasError && (
              <span className="text-sm text-ink-error mt-1">
                {errorMessage}
              </span>
            )}
            {!hasError && helperText && (
              <span className="text-sm text-inputs-text-off mt-1">
                {helperText}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}

CheckboxTree.displayName = 'CheckboxTree'

export default CheckboxTree
