import React, { useMemo } from 'react'
import { ChevronDown, ChevronRight, Settings } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { componentConfigs } from '@/utils/componentRegistry'

const PropertyPanel: React.FC = () => {
  const { selectedId, components, updateProps } = useEditorStore()
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['基础', '样式']))

  const selectedComponent = useMemo(() => {
    function findComponent(list: any[]): any {
      for (const comp of list) {
        if (comp.id === selectedId) return comp
        if (comp.children?.length > 0) {
          const found = findComponent(comp.children)
          if (found) return found
        }
      }
      return null
    }
    return findComponent(components)
  }, [components, selectedId])

  const config = selectedComponent ? componentConfigs[selectedComponent.type] : null

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  const handlePropChange = (key: string, value: any) => {
    if (selectedComponent) {
      updateProps(selectedComponent.id, { [key]: value })
    }
  }

  const groupedProps = useMemo(() => {
    if (!config) return {}
    const groups: Record<string, typeof config.propConfig> = {}
    config.propConfig.forEach((prop) => {
      const group = prop.group || '其他'
      if (!groups[group]) groups[group] = []
      groups[group].push(prop)
    })
    return groups
  }, [config])

  if (!selectedComponent || !config) {
    return (
      <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Settings size={16} />
            属性面板
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
          <Settings size={32} className="mb-3 opacity-30" />
          <p className="text-sm text-center">
            选中画布中的组件<br />即可编辑属性
          </p>
        </div>
      </div>
    )
  }

  const renderPropControl = (prop: any) => {
    const value = selectedComponent.props[prop.key]

    switch (prop.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handlePropChange(prop.key, e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
          />
        )
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handlePropChange(prop.key, e.target.value)}
            rows={3}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 resize-none"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => handlePropChange(prop.key, Number(e.target.value))}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
          />
        )
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handlePropChange(prop.key, e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 bg-white"
          >
            {prop.options?.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      case 'color':
        return (
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handlePropChange(prop.key, e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handlePropChange(prop.key, e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        )
      case 'boolean':
        return (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handlePropChange(prop.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Settings size={16} />
          {config.label} 属性
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          ID: {selectedComponent.id}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedProps).map(([group, props]) => (
          <div key={group} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{group}</span>
              {expandedGroups.has(group) ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>
            {expandedGroups.has(group) && (
              <div className="px-4 pb-3 space-y-3">
                {props.map((prop: any) => (
                  <div key={prop.key}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {prop.label}
                    </label>
                    {renderPropControl(prop)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PropertyPanel
