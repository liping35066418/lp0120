import React from 'react'

interface CardProps {
  title?: string
  showHeader?: boolean
  shadow?: string
  styles?: Record<string, string>
  children?: React.ReactNode
}

const shadowMap: Record<string, string> = {
  none: 'none',
  small: '0 1px 3px rgba(0,0,0,0.1)',
  medium: '0 4px 6px rgba(0,0,0,0.1)',
  large: '0 10px 15px rgba(0,0,0,0.1)',
}

const DisplayCard: React.FC<CardProps> = ({
  title = '卡片',
  showHeader = true,
  shadow = 'medium',
  styles = {},
  children,
}) => {
  return (
    <div
      className="w-full bg-white rounded-xl overflow-hidden"
      style={{
        boxShadow: shadowMap[shadow] || shadow,
        ...styles,
      }}
    >
      {showHeader && (
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-5 space-y-3">
        {children}
      </div>
    </div>
  )
}

export default DisplayCard
