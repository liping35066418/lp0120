import React from 'react'

interface ColProps {
  span?: number
  minWidth?: string
  styles?: Record<string, string>
  children?: React.ReactNode
}

const LayoutCol: React.FC<ColProps> = ({
  span = 1,
  minWidth = '0',
  styles = {},
  children,
}) => {
  return (
    <div
      style={{
        flex: span,
        minWidth,
        ...styles,
      }}
      className="space-y-3"
    >
      {children}
    </div>
  )
}

export default LayoutCol
