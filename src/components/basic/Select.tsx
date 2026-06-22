import React from 'react'

interface SelectProps {
  label?: string
  placeholder?: string
  showLabel?: boolean
  disabled?: boolean
  styles?: Record<string, string>
  children?: React.ReactNode
}

const BasicSelect: React.FC<SelectProps> = ({
  label = '选择',
  placeholder = '请选择',
  showLabel = true,
  disabled = false,
  styles = {},
}) => {
  return (
    <div className="w-full">
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        disabled={disabled}
        style={styles}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 appearance-none bg-white bg-no-repeat bg-right"
      >
        <option value="">{placeholder}</option>
        <option value="1">选项一</option>
        <option value="2">选项二</option>
        <option value="3">选项三</option>
      </select>
    </div>
  )
}

export default BasicSelect
