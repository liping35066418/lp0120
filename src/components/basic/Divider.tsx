import React from 'react'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  color?: string
  thickness?: string
  styles?: Record<string, string>
}

const BasicDivider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = '#e5e7eb',
  thickness = '1px',
  styles = {},
}) => {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      style={{
        backgroundColor: color,
        height: isHorizontal ? thickness : '100%',
        width: isHorizontal ? '100%' : thickness,
        ...styles,
      }}
      className="my-2"
    />
  )
}

export default BasicDivider
