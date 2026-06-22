import React from 'react'

interface RowProps {
  gap?: string
  align?: string
  styles?: Record<string, string>
  children?: React.ReactNode
}

const LayoutRow: React.FC<RowProps> = ({
  gap = '16px',
  align = 'stretch',
  styles = {},
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap,
        alignItems: align as any,
        ...styles,
      }}
      className="w-full"
    >
      {children}
    </div>
  )
}

export default LayoutRow
