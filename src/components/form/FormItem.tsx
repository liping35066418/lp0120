import React from 'react'

interface FormItemProps {
  label?: string
  required?: boolean
  styles?: Record<string, string>
  children?: React.ReactNode
}

const FormItem: React.FC<FormItemProps> = ({
  label = '表单项',
  required = false,
  styles = {},
  children,
}) => {
  return (
    <div className="w-full" style={styles}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {required && <span className="text-red-500 mr-1">*</span>}
        {label}
      </label>
      <div>{children}</div>
    </div>
  )
}

export default FormItem
