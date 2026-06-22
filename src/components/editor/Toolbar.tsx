import React, { useState } from 'react'
import {
  Monitor,
  Smartphone,
  Undo2,
  Redo2,
  Save,
  Palette,
  AlertTriangle,
  Check,
  X,
  ChevronDown,
} from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { themes } from '@/utils/componentRegistry'
import clsx from 'clsx'

const Toolbar: React.FC = () => {
  const {
    device,
    theme,
    setDevice,
    setTheme,
    undo,
    redo,
    historyIndex,
    history,
    validationErrors,
    saveTemplate,
    templateName,
    setTemplateName,
  } = useEditorStore()

  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null)

  const errorCount = validationErrors.filter((e) => e.severity === 'error').length
  const warningCount = validationErrors.filter((e) => e.severity === 'warning').length

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const currentTheme = themes.find((t) => t.id === theme) || themes[0]

  const handleSave = () => {
    const result = saveTemplate()
    if (result.success) {
      setSaveResult({ success: true, message: '模板保存成功！' })
    } else {
      setSaveResult({ success: false, message: `存在 ${result.errors.filter((e) => e.severity === 'error').length} 个错误，无法保存` })
    }
    setTimeout(() => setSaveResult(null), 3000)
  }

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
          <Palette size={18} className="text-white" />
        </div>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="text-sm font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 w-40"
        />
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => setDevice('pc')}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
            device === 'pc'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Monitor size={14} />
          PC
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
            device === 'mobile'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Smartphone size={14} />
          移动端
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            canUndo
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          )}
          title="撤销"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            canRedo
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          )}
          title="重做"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="relative">
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentTheme.primaryColor }}
          />
          {currentTheme.name}
          <ChevronDown size={14} className="text-gray-400" />
        </button>
        {showThemeMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[140px]">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setShowThemeMenu(false)
                }}
                className={clsx(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors',
                  theme === t.id ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                )}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: t.primaryColor }}
                />
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {(errorCount > 0 || warningCount > 0) && (
        <div className="flex items-center gap-3">
          {errorCount > 0 && (
            <div className="flex items-center gap-1.5 text-red-500 text-sm">
              <X size={14} className="bg-red-500 text-white rounded-full p-0.5" />
              <span className="font-medium">{errorCount} 错误</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 text-amber-500 text-sm">
              <AlertTriangle size={14} />
              <span className="font-medium">{warningCount} 警告</span>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm hover:shadow-md"
        >
          <Save size={16} />
          保存模板
        </button>
        {saveResult && (
          <div
            className={clsx(
              'absolute top-full right-0 mt-2 px-3 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2 whitespace-nowrap z-50',
              saveResult.success
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            )}
          >
            {saveResult.success ? <Check size={14} /> : <X size={14} />}
            {saveResult.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Toolbar
