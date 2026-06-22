import React from 'react'
import clsx from 'clsx'

interface ButtonProps {
  text?: string
  variant?: 'primary' | 'secondary' | 'text' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  styles?: Record<string, string>
  children?: React.ReactNode
}

const BasicButton: React.FC<ButtonProps> = ({
  text = '按钮',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  styles = {},
  children,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
    text: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        'w-full sm:w-auto'
      )}
      disabled={disabled}
      style={styles}
    >
      {children || text}
    </button>
  )
}

export default BasicButton
