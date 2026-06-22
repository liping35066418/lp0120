import React from 'react'

interface FormContainerProps {
  layout?: 'vertical' | 'horizontal' | 'inline'
  labelWidth?: string
  labelPosition?: 'left' | 'right' | 'top'
  styles?: Record<string, string>
  children?: React.ReactNode
}

const FormContainer: React.FC<FormContainerProps> = ({
  layout = 'vertical',
  labelWidth = '100px',
  labelPosition = 'right',
  styles = {},
  children,
}) => {
  const isHorizontal = layout === 'horizontal'

  return (
    <div
      className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200"
      style={styles}
    >
      <div className={`space-y-4 ${isHorizontal ? 'space-y-2' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default FormContainer
