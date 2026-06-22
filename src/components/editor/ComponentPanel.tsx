import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { componentConfigs, categoryList } from '@/utils/componentRegistry'
import * as Icons from 'lucide-react'
import clsx from 'clsx'

interface ComponentPanelProps {
  onDragStart?: (type: string) => void
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({ onDragStart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('basic')
  const [searchKeyword, setSearchKeyword] = useState('')

  const filteredComponents = useMemo(() => {
    const all = Object.values(componentConfigs)
    return all.filter((c) => {
      const matchCategory = c.category === activeCategory || activeCategory === 'all'
      const matchSearch = c.label.includes(searchKeyword) || c.type.includes(searchKeyword)
      return matchCategory && matchSearch
    })
  }, [activeCategory, searchKeyword])

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName]
    return Icon ? <Icon size={18} /> : <Icons.Box size={18} />
  }

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type)
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart?.(type)
  }

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">组件库</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索组件..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100">
        {categoryList.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={clsx(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              activeCategory === cat.key
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {filteredComponents.map((comp) => (
            <div
              key={comp.type}
              draggable
              onDragStart={(e) => handleDragStart(e, comp.type)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-primary-50 hover:border-primary-300 border border-gray-200 rounded-lg cursor-grab hover:shadow-sm transition-all duration-200 group"
            >
              <div className="w-8 h-8 flex items-center justify-center text-gray-500 group-hover:text-primary-600 mb-1.5">
                {getIcon(comp.icon)}
              </div>
              <span className="text-xs text-gray-600 group-hover:text-primary-700 font-medium">
                {comp.label}
              </span>
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
          暂无匹配的组件
        </div>
        )}
      </div>
    </div>
  )
}

export default ComponentPanel
