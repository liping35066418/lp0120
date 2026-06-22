import React from 'react'

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  showLabel?: boolean
  disabled?: boolean
  styles?: Record<string, string>
  children?: React.ReactNode
}

const BasicInput: React.FC<InputProps> = ({
  label = '输入框',
  placeholder = '请输入',
  value = '',
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
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        style={styles}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400"
      />
    </div>
  )
}

export default BasicInput
