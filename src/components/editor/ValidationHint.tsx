import React from 'react'
import { AlertTriangle, X, ChevronRight, ChevronLeft } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import clsx from 'clsx'

const ValidationHint: React.FC = () => {
  const {
    validationErrors,
    showValidationPanel,
    toggleValidationPanel,
    setSelectedId,
    selectedId,
  } = useEditorStore()

  const errorCount = validationErrors.filter((e) => e.severity === 'error').length
  const warningCount = validationErrors.filter((e) => e.severity === 'warning').length

  const handleClickError = (componentId: string) => {
    setSelectedId(componentId)
  }

  if (!showValidationPanel && validationErrors.length === 0) {
    return null
  }

  return (
    <>
      <button
        onClick={toggleValidationPanel}
        className={clsx(
          'fixed right-72 top-1/2 -translate-y-1/2 z-40',
          'w-7 h-20 bg-white border border-gray-200 border-r-0 rounded-l-lg',
          'flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow',
          validationErrors.length > 0 && 'animate-pulse'
        )}
      >
        {showValidationPanel ? (
          <ChevronRight size={18} className="text-gray-500" />
        ) : (
          <div className="relative">
            <AlertTriangle
              size={18}
              className={errorCount > 0 ? 'text-red-500' : 'text-amber-500'}
            />
            {validationErrors.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                {validationErrors.length}
              </span>
            )}
          </div>
        )}
      </button>

      {showValidationPanel && (
        <div className="w-72 h-full bg-white border-l border-gray-200 flex flex-col z-30">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              布局校验
            </h2>
            <span className="text-xs text-gray-400">
              共 {validationErrors.length} 项
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {validationErrors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm">布局校验通过</p>
                <p className="text-xs mt-1">没有发现任何问题</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {validationErrors.map((error) => (
                  <button
                    key={error.id}
                    onClick={() => handleClickError(error.componentId)}
                    className={clsx(
                      'w-full p-3 text-left hover:bg-gray-50 transition-colors',
                      selectedId === error.componentId && 'bg-primary-50'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {error.severity === 'error' ? (
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X size={12} className="text-red-500" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle size={12} className="text-amber-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={clsx(
                            'text-xs font-medium',
                            error.severity === 'error' ? 'text-red-700' : 'text-amber-700'
                          )}
                        >
                          {error.severity === 'error' ? '错误' : '警告'}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {error.message}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          类型: {error.type}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">错误</span>
              <span className="font-medium text-red-600">{errorCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-500">警告</span>
              <span className="font-medium text-amber-600">{warningCount}</span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] text-gray-400 text-center">
                存在错误时无法保存模板
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ValidationHint
