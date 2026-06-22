import React from 'react'

interface ModalProps {
  title?: string
  width?: string
  visible?: boolean
  showFooter?: boolean
  styles?: Record<string, string>
  children?: React.ReactNode
}

const FeedbackModal: React.FC<ModalProps> = ({
  title = '弹窗',
  width = '520px',
  visible = true,
  showFooter = true,
  styles = {},
  children,
}) => {
  if (!visible) return null

  return (
    <div className="relative w-full" style={styles}>
      <div
        className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto"
        style={{ width, maxWidth: '100%' }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 min-h-[100px] space-y-3">
          {children}
        </div>
        {showFooter && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors">
              确定
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedbackModal
