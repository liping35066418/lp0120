export interface ComponentNode {
  id: string
  type: string
  props: Record<string, any>
  children: ComponentNode[]
  styles: Record<string, string>
  locked?: boolean
}

export interface ValidationError {
  id: string
  componentId: string
  type: 'nesting' | 'overflow' | 'rule' | 'mobile'
  message: string
  severity: 'error' | 'warning'
}

export interface ComponentConfig {
  type: string
  label: string
  icon: string
  category: string
  defaultProps: Record<string, any>
  defaultStyles: Record<string, string>
  canHaveChildren: boolean
  allowedParents: string[]
  allowedChildren: string[]
  propConfig: PropConfig[]
}

export interface PropConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'color' | 'boolean' | 'textarea'
  options?: { label: string; value: any }[]
  group?: string
}

export interface ThemeConfig {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
}

export type DeviceType = 'pc' | 'mobile'

export interface EditorState {
  components: ComponentNode[]
  selectedId: string | null
  hoveredId: string | null
  device: DeviceType
  theme: string
  history: ComponentNode[][]
  historyIndex: number
  validationErrors: ValidationError[]
  showValidationPanel: boolean
  templateName: string
}
