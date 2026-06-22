import React from 'react'

interface ContainerProps {
  padding?: string
  background?: string
  borderRadius?: string
  border?: string
  shadow?: string
  styles?: Record<string, string>
  children?: React.ReactNode
}

const LayoutContainer: React.FC<ContainerProps> = ({
  padding = '16px',
  background = '#ffffff',
  borderRadius = '8px',
  border = 'none',
  shadow = 'none',
  styles = {},
  children,
}) => {
  return (
    <div
      style={{
        padding,
        background,
        borderRadius,
        border,
        boxShadow: shadow,
        ...styles,
      }}
      className="w-full min-h-[40px]"
    >
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

export default LayoutContainer
