import React from 'react'
import type { ComponentNode } from '@/types'
import { componentConfigs } from '@/utils/componentRegistry'
import BasicButton from '@/components/basic/Button'
import BasicInput from '@/components/basic/Input'
import BasicSelect from '@/components/basic/Select'
import BasicText from '@/components/basic/Text'
import BasicImage from '@/components/basic/Image'
import BasicDivider from '@/components/basic/Divider'
import LayoutContainer from '@/components/layout/Container'
import LayoutRow from '@/components/layout/Row'
import LayoutCol from '@/components/layout/Col'
import FormContainer from '@/components/form/FormContainer'
import FormItem from '@/components/form/FormItem'
import DisplayTable from '@/components/display/Table'
import DisplayCard from '@/components/display/Card'
import FeedbackModal from '@/components/feedback/Modal'

interface ComponentRendererProps {
  component: ComponentNode
  isSelected?: boolean
  isHovered?: boolean
  hasError?: boolean
  hasWarning?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children?: React.ReactNode
}

const componentMap: Record<string, React.ComponentType<any>> = {
  'basic-button': BasicButton,
  'basic-input': BasicInput,
  'basic-select': BasicSelect,
  'basic-text': BasicText,
  'basic-image': BasicImage,
  'basic-divider': BasicDivider,
  'layout-container': LayoutContainer,
  'layout-row': LayoutRow,
  'layout-col': LayoutCol,
  'form-container': FormContainer,
  'form-item': FormItem,
  'display-table': DisplayTable,
  'display-card': DisplayCard,
  'feedback-modal': FeedbackModal,
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  isHovered,
  hasError,
  hasWarning,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  const config = componentConfigs[component.type]
  const Comp = componentMap[component.type]

  if (!Comp) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
        未知组件: {component.type}
      </div>
    )
  }

  return (
    <div
      className={`
        relative group/component
        ${isSelected ? 'ring-2 ring-primary-500 ring-offset-1' : ''}
        ${isHovered && !isSelected ? 'ring-1 ring-primary-300' : ''}
        ${hasError ? 'ring-2 ring-red-500 animate-pulse' : ''}
        ${hasWarning && !hasError ? 'ring-2 ring-warning' : ''}
        rounded transition-all duration-150
      `}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onMouseEnter={(e) => {
        e.stopPropagation()
        onMouseEnter?.()
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        onMouseLeave?.()
      }}
    >
      {isSelected && (
        <div className="absolute -top-7 left-0 z-10">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded">
            {config?.label || component.type}
          </span>
        </div>
      )}
      <Comp {...component.props} styles={component.styles}>
        {config?.canHaveChildren && children}
      </Comp>
    </div>
  )
}

export default ComponentRenderer
