import React, { useCallback, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import ComponentRenderer from '@/components/ComponentRenderer'
import type { ComponentNode } from '@/types'
import { componentConfigs } from '@/utils/componentRegistry'

interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = () => {
  const {
    components,
    selectedId,
    hoveredId,
    device,
    setSelectedId,
    setHoveredId,
    addNewComponent,
    deleteComponent,
    validationErrors,
  } = useEditorStore()

  const [dragOverParentId, setDragOverParentId] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number>(-1)
  const canvasRef = useRef<HTMLDivElement>(null)

  const deviceWidth = device === 'pc' ? '100%' : '375px'
  const deviceMaxWidth = device === 'pc' ? '1200px' : '375px'

  const hasError = useCallback(
    (id: string) => validationErrors.some((e) => e.componentId === id && e.severity === 'error'),
    [validationErrors]
  )

  const hasWarning = useCallback(
    (id: string) => validationErrors.some((e) => e.componentId === id && e.severity === 'warning'),
    [validationErrors]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent, parentId: string | null, index: number = -1) => {
      e.preventDefault()
      e.stopPropagation()

      const type = e.dataTransfer.getData('componentType')
      if (type) {
        addNewComponent(type, parentId, index)
      }

      setDragOverParentId(null)
      setDragIndex(-1)
    },
    [addNewComponent]
  )

  const handleDragOver = useCallback((e: React.DragEvent, parentId: string | null) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOverParentId(parentId)
  }, [])

  const handleDragLeave = useCallback(() => {
    // setDragOverParentId(null)
  }, [])

  const renderComponents = (list: ComponentNode[], parentId: string | null = null) => {
    return list.map((comp, index) => {
      const config = componentConfigs[comp.type]
      const isSelected = selectedId === comp.id
      const isHovered = hoveredId === comp.id
      const isDragOver = dragOverParentId === comp.id && config?.canHaveChildren
      const showDropHint = dragOverParentId === parentId && dragIndex === index

      return (
        <div key={comp.id} className="relative">
          {showDropHint && (
            <div className="h-12 mb-2 border-2 border-dashed border-primary-400 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 text-sm">
              <Plus size={16} className="mr-1" />
              放置组件
            </div>
          )}
          <div
            onDragOver={(e) => {
              if (config?.canHaveChildren) {
                handleDragOver(e, comp.id)
              }
            }}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              if (config?.canHaveChildren) {
                handleDrop(e, comp.id)
              }
            }}
            className={`relative ${isDragOver ? 'ring-2 ring-primary-400 ring-inset bg-primary-50/50' : ''}`}
          >
            {isSelected && (
              <div className="absolute -right-2 top-2 z-20 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteComponent(comp.id)
                  }}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-lg"
                  title="删除组件"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            <ComponentRenderer
              component={comp}
              isSelected={isSelected}
              isHovered={isHovered}
              hasError={hasError(comp.id)}
              hasWarning={hasWarning(comp.id)}
              onClick={() => setSelectedId(comp.id)}
              onMouseEnter={() => setHoveredId(comp.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {config?.canHaveChildren && comp.children.length > 0 ? (
                <div className="min-h-[20px]">
                  {renderComponents(comp.children, comp.id)}
                </div>
              ) : null}
            </ComponentRenderer>

            {config?.canHaveChildren && comp.children.length === 0 && isDragOver && (
              <div className="py-4 text-center text-sm text-gray-400 border border-dashed border-gray-300 rounded mt-2">
                拖拽组件到此处
              </div>
            )}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8 flex items-start justify-center">
      <div
        ref={canvasRef}
        className="relative transition-all duration-300 ease-out"
        style={{
          width: deviceWidth,
          maxWidth: deviceMaxWidth,
        }}
      >
        {device === 'mobile' && (
          <div className="absolute -top-3 -left-3 -right-3 -bottom-3 bg-gray-800 rounded-[3rem] p-3 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden">
              <div className="h-6 bg-gray-800 flex items-center justify-center">
                <div className="w-20 h-1.5 bg-gray-700 rounded-full"></div>
              </div>
              <div
                className="bg-white min-h-[600px] overflow-auto"
                style={{ width: '100%' }}
                onDragOver={(e) => handleDragOver(e, null)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, null)}
              >
                <div className="p-4 space-y-3">
                  {components.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                      <Plus size={32} className="mb-3 opacity-50" />
                      <p className="text-sm">从左侧拖拽组件到这里</p>
                    </div>
                  ) : (
                    renderComponents(components, null)
                  )}
                  {dragOverParentId === null && (
                    <div className="h-16 border-2 border-dashed border-primary-400 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 text-sm mt-3">
                      <Plus size={16} className="mr-1" />
                      放置组件
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {device === 'pc' && (
          <div
            className="bg-white min-h-[600px] shadow-canvas rounded-lg overflow-hidden"
            onDragOver={(e) => handleDragOver(e, null)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, null)}
          >
            <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="h-5 bg-white rounded border border-gray-200 max-w-md mx-auto">
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {components.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                  <Plus size={40} className="mb-3 opacity-50" />
                  <p className="text-base">从左侧拖拽组件到画布开始搭建页面</p>
                  <p className="text-sm mt-1 opacity-70">支持表单、表格、弹窗等多种业务组件</p>
                </div>
              ) : (
                renderComponents(components, null)
              )}
              {dragOverParentId === null && components.length > 0 && (
                <div className="h-16 border-2 border-dashed border-primary-400 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 text-sm">
                  <Plus size={16} className="mr-1" />
                  放置组件
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Canvas
