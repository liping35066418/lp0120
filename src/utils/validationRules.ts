import type { ComponentNode, ValidationError, DeviceType } from '@/types'
import { componentConfigs } from './componentRegistry'

function generateId(): string {
  return 'comp_' + Math.random().toString(36).substr(2, 9)
}

export function createComponent(type: string): ComponentNode {
  const config = componentConfigs[type]
  if (!config) {
    throw new Error(`Component type "${type}" not found`)
  }
  return {
    id: generateId(),
    type,
    props: { ...config.defaultProps },
    children: [],
    styles: { ...config.defaultStyles },
  }
}

function findComponentById(
  components: ComponentNode[],
  id: string
): ComponentNode | null {
  for (const comp of components) {
    if (comp.id === id) return comp
    if (comp.children.length > 0) {
      const found = findComponentById(comp.children, id)
      if (found) return found
    }
  }
  return null
}

function findParentComponent(
  components: ComponentNode[],
  id: string,
  parent: ComponentNode | null = null
): ComponentNode | null {
  for (const comp of components) {
    if (comp.id === id) return parent
    if (comp.children.length > 0) {
      const found = findParentComponent(comp.children, id, comp)
      if (found !== null) return found
    }
  }
  return null
}

export function addComponent(
  components: ComponentNode[],
  newComponent: ComponentNode,
  parentId: string | null,
  index: number = -1
): ComponentNode[] {
  const newComponents = JSON.parse(JSON.stringify(components)) as ComponentNode[]

  if (!parentId) {
    if (index === -1) {
      newComponents.push(newComponent)
    } else {
      newComponents.splice(index, 0, newComponent)
    }
    return newComponents
  }

  function addToChildren(list: ComponentNode[]): boolean {
    for (const comp of list) {
      if (comp.id === parentId) {
        const config = componentConfigs[comp.type]
        if (config && !config.canHaveChildren) {
          return false
        }
        if (index === -1) {
          comp.children.push(newComponent)
        } else {
          comp.children.splice(index, 0, newComponent)
        }
        return true
      }
      if (comp.children.length > 0 && addToChildren(comp.children)) {
        return true
      }
    }
    return false
  }

  addToChildren(newComponents)
  return newComponents
}

export function removeComponent(
  components: ComponentNode[],
  id: string
): ComponentNode[] {
  const newComponents = JSON.parse(JSON.stringify(components)) as ComponentNode[]

  function removeFromList(list: ComponentNode[]): boolean {
    const index = list.findIndex(c => c.id === id)
    if (index !== -1) {
      list.splice(index, 1)
      return true
    }
    for (const comp of list) {
      if (comp.children.length > 0 && removeFromList(comp.children)) {
        return true
      }
    }
    return false
  }

  removeFromList(newComponents)
  return newComponents
}

export function updateComponentProps(
  components: ComponentNode[],
  id: string,
  props: Record<string, any>
): ComponentNode[] {
  const newComponents = JSON.parse(JSON.stringify(components)) as ComponentNode[]

  function update(list: ComponentNode[]): boolean {
    for (const comp of list) {
      if (comp.id === id) {
        comp.props = { ...comp.props, ...props }
        return true
      }
      if (comp.children.length > 0 && update(comp.children)) {
        return true
      }
    }
    return false
  }

  update(newComponents)
  return newComponents
}

export function moveComponent(
  components: ComponentNode[],
  sourceId: string,
  targetParentId: string | null,
  targetIndex: number
): ComponentNode[] {
  const sourceComp = findComponentById(components, sourceId)
  if (!sourceComp) return components

  let newComponents = removeComponent(components, sourceId)
  newComponents = addComponent(newComponents, sourceComp, targetParentId, targetIndex)
  return newComponents
}

export function isDescendant(
  components: ComponentNode[],
  ancestorId: string,
  descendantId: string
): boolean {
  function search(list: ComponentNode[], isInside: boolean = false): boolean {
    for (const comp of list) {
      if (comp.id === ancestorId) {
        if (search(comp.children, true)) return true
      } else if (isInside && comp.id === descendantId) {
        return true
      }
      if (comp.children.length > 0) {
        if (search(comp.children, isInside || comp.id === ancestorId)) return true
      }
    }
    return false
  }
  return search(components)
}

export function cloneComponent(
  component: ComponentNode
): ComponentNode {
  const idMap = new Map<string, string>()

  function generateNewId(): string {
    return 'comp_' + Math.random().toString(36).substr(2, 9)
  }

  function cloneNode(node: ComponentNode): ComponentNode {
    const newId = generateNewId()
    idMap.set(node.id, newId)
    return {
      id: newId,
      type: node.type,
      props: { ...node.props },
      styles: { ...node.styles },
      children: node.children.map(cloneNode),
    }
  }

  return cloneNode(component)
}

export function findComponentAndParent(
  components: ComponentNode[],
  id: string
): { component: ComponentNode; parent: ComponentNode | null; index: number; list: ComponentNode[] } | null {
  function search(
    list: ComponentNode[],
    parent: ComponentNode | null
  ): { component: ComponentNode; parent: ComponentNode | null; index: number; list: ComponentNode[] } | null {
    for (let i = 0; i < list.length; i++) {
      const comp = list[i]
      if (comp.id === id) {
        return { component: comp, parent, index: i, list }
      }
      if (comp.children.length > 0) {
        const found = search(comp.children, comp)
        if (found) return found
      }
    }
    return null
  }
  return search(components, null)
}

export function validateNesting(
  components: ComponentNode[],
  device: DeviceType
): ValidationError[] {
  const errors: ValidationError[] = []

  function validateList(list: ComponentNode[], parentType: string = 'root', depth: number = 0) {
    list.forEach((comp, index) => {
      const config = componentConfigs[comp.type]
      if (!config) return

      if (config.allowedParents && config.allowedParents.length > 0) {
        const parentConfig = parentType === 'root' ? null : componentConfigs[parentType]
        const parentAllows = !parentConfig || 
          parentConfig.allowedChildren?.includes('*') || 
          parentConfig.allowedChildren?.includes(comp.type)
        const childAllows = config.allowedParents.includes('*') || config.allowedParents.includes(parentType)
        
        if (!parentAllows && !childAllows) {
          errors.push({
            id: `nest_${comp.id}`,
            componentId: comp.id,
            type: 'nesting',
            message: `"${config.label}" 不能直接放在 ${parentConfig?.label || '根节点'} 内`,
            severity: 'error',
          })
        }
      }

      if (comp.type === 'form-container') {
        const hasFormChildren = comp.children.some(
          c => c.type.startsWith('form-') || c.type.startsWith('basic-')
        )
        if (comp.children.length > 0 && !hasFormChildren) {
          // 表单容器允许空
        }
      }

      if (comp.type === 'layout-row') {
        const allCols = comp.children.every(c => c.type === 'layout-col')
        if (comp.children.length > 0 && !allCols) {
          errors.push({
            id: `nest_row_${comp.id}`,
            componentId: comp.id,
            type: 'nesting',
            message: '行布局内只能放置列布局组件',
            severity: 'error',
          })
        }
      }

      if (config.canHaveChildren && comp.children.length > 0) {
        validateList(comp.children, comp.type, depth + 1)
      }

      if (!config.canHaveChildren && comp.children.length > 0) {
        errors.push({
          id: `nochild_${comp.id}`,
          componentId: comp.id,
          type: 'nesting',
          message: `"${config.label}" 不能包含子组件`,
          severity: 'error',
        })
      }

      if (depth > 8) {
        errors.push({
          id: `depth_${comp.id}`,
          componentId: comp.id,
          type: 'nesting',
          message: '组件嵌套层级过深，建议不超过8层',
          severity: 'warning',
        })
      }
    })
  }

  validateList(components)
  return errors
}

export function validateMobileAdaptation(
  components: ComponentNode[]
): ValidationError[] {
  const errors: ValidationError[] = []
  const mobileWidth = 375

  function checkOverflow(list: ComponentNode[]) {
    list.forEach(comp => {
      const config = componentConfigs[comp.type]
      if (!config) return

      const width = comp.props.width || comp.styles.width
      if (width) {
        const widthNum = parseInt(width)
        if (!isNaN(widthNum) && widthNum > mobileWidth) {
          errors.push({
            id: `overflow_${comp.id}`,
            componentId: comp.id,
            type: 'overflow',
            message: `组件宽度 ${width} 超过移动端画布宽度 (${mobileWidth}px)`,
            severity: 'warning',
          })
        }
      }

      if (comp.type === 'layout-row' && comp.children.length > 2) {
        errors.push({
          id: `mobile_cols_${comp.id}`,
          componentId: comp.id,
          type: 'mobile',
          message: '多列布局在移动端可能显示拥挤，建议使用2列以内',
          severity: 'warning',
        })
      }

      if (comp.type === 'basic-button') {
        const size = comp.props.size
        if (size === 'small') {
          errors.push({
            id: `btn_size_${comp.id}`,
            componentId: comp.id,
            type: 'mobile',
            message: '移动端按钮建议使用中等及以上尺寸，确保点击区域不小于44px',
            severity: 'warning',
          })
        }
      }

      if (comp.type === 'display-table') {
        const cols = comp.props.columns || 3
        if (cols > 3) {
          errors.push({
            id: `table_cols_${comp.id}`,
            componentId: comp.id,
            type: 'mobile',
            message: '表格列数过多在移动端可能横向滚动，建议不超过3列',
            severity: 'warning',
          })
        }
      }

      if (comp.children.length > 0) {
        checkOverflow(comp.children)
      }
    })
  }

  checkOverflow(components)
  return errors
}

export function runAllValidations(
  components: ComponentNode[],
  device: DeviceType
): ValidationError[] {
  const nestingErrors = validateNesting(components, device)
  const mobileErrors = device === 'mobile' ? validateMobileAdaptation(components) : []
  return [...nestingErrors, ...mobileErrors]
}

export function hasErrors(errors: ValidationError[]): boolean {
  return errors.some(e => e.severity === 'error')
}

export function hasWarnings(errors: ValidationError[]): boolean {
  return errors.some(e => e.severity === 'warning')
}

export function canSave(errors: ValidationError[]): boolean {
  return !hasErrors(errors)
}
