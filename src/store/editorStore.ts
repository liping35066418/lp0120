import { create } from 'zustand'
import type { EditorState, ComponentNode, ValidationError, DeviceType } from '@/types'
import { createComponent, addComponent, removeComponent, updateComponentProps, moveComponent, runAllValidations, canSave, cloneComponent, findComponentAndParent } from '@/utils/validationRules'
import { applyTheme } from '@/utils/theme'

const initialComponents: ComponentNode[] = [
  {
    id: 'demo_1',
    type: 'display-card',
    props: { title: '欢迎使用可视化编辑器', showHeader: true, shadow: 'medium' },
    styles: {},
    children: [
      {
        id: 'demo_2',
        type: 'basic-text',
        props: { content: '拖拽左侧组件到画布中开始搭建你的页面模板', fontSize: '14px', color: '#6b7280' },
        styles: {},
        children: [],
      },
      {
        id: 'demo_3',
        type: 'layout-container',
        props: { padding: '0', background: 'transparent', borderRadius: '0' },
        styles: {},
        children: [
          {
            id: 'demo_4',
            type: 'basic-button',
            props: { text: '开始使用', variant: 'primary', size: 'medium' },
            styles: {},
            children: [],
          },
        ],
      },
    ],
  },
]

interface EditorActions {
  setSelectedId: (id: string | null) => void
  setHoveredId: (id: string | null) => void
  setDevice: (device: DeviceType) => void
  setTheme: (theme: string) => void
  addNewComponent: (type: string, parentId: string | null, index?: number) => void
  deleteComponent: (id: string) => void
  updateProps: (id: string, props: Record<string, any>) => void
  moveComponentById: (sourceId: string, targetParentId: string | null, targetIndex: number) => void
  duplicateComponent: (id: string) => void
  undo: () => void
  redo: () => void
  saveTemplate: () => { success: boolean; errors: ValidationError[] }
  loadTemplate: (components: ComponentNode[]) => void
  toggleValidationPanel: () => void
  setTemplateName: (name: string) => void
  validate: () => void
}

const HISTORY_MERGE_WINDOW = 1000

let lastUpdateId: string | null = null
let lastUpdateKey: string | null = null
let lastUpdateTime = 0

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  components: initialComponents,
  selectedId: null,
  hoveredId: null,
  device: 'pc',
  theme: 'default',
  history: [initialComponents],
  historyIndex: 0,
  validationErrors: [],
  showValidationPanel: false,
  templateName: '未命名模板',

  setSelectedId: (id) => set({ selectedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),

  setDevice: (device) => {
    set({ device })
    get().validate()
  },

  setTheme: (theme) => {
    set({ theme })
    applyTheme(theme)
  },

  addNewComponent: (type, parentId, index = -1) => {
    const { components, history, historyIndex } = get()
    const newComp = createComponent(type)
    const newComponents = addComponent(components, newComp, parentId, index)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newComponents)
    set({
      components: newComponents,
      selectedId: newComp.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
    lastUpdateId = null
    lastUpdateKey = null
    lastUpdateTime = 0
    get().validate()
  },

  deleteComponent: (id) => {
    const { components, selectedId, history, historyIndex } = get()
    const newComponents = removeComponent(components, id)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newComponents)
    set({
      components: newComponents,
      selectedId: selectedId === id ? null : selectedId,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
    lastUpdateId = null
    lastUpdateKey = null
    lastUpdateTime = 0
    get().validate()
  },

  updateProps: (id, props) => {
    const { components, history, historyIndex } = get()
    const now = Date.now()
    const propKey = Object.keys(props)[0]

    const shouldMerge =
      lastUpdateId === id &&
      lastUpdateKey === propKey &&
      now - lastUpdateTime < HISTORY_MERGE_WINDOW

    const newComponents = updateComponentProps(components, id, props)

    if (shouldMerge) {
      const newHistory = [...history]
      newHistory[historyIndex] = newComponents
      set({
        components: newComponents,
        history: newHistory,
      })
    } else {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newComponents)
      set({
        components: newComponents,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      })
    }

    lastUpdateId = id
    lastUpdateKey = propKey
    lastUpdateTime = now

    get().validate()
  },

  moveComponentById: (sourceId, targetParentId, targetIndex) => {
    const { components, history, historyIndex } = get()
    const newComponents = moveComponent(components, sourceId, targetParentId, targetIndex)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newComponents)
    set({
      components: newComponents,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
    lastUpdateId = null
    lastUpdateKey = null
    lastUpdateTime = 0
    get().validate()
  },

  duplicateComponent: (id) => {
    const { components, history, historyIndex, selectedId } = get()
    const found = findComponentAndParent(components, id)
    if (!found) return

    const { component, parent, index } = found
    const cloned = cloneComponent(component)

    const parentId = parent ? parent.id : null
    const newComponents = addComponent(components, cloned, parentId, index + 1)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newComponents)
    set({
      components: newComponents,
      selectedId: cloned.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
    lastUpdateId = null
    lastUpdateKey = null
    lastUpdateTime = 0
    get().validate()
  },

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({
        components: history[newIndex],
        historyIndex: newIndex,
        selectedId: null,
      })
      lastUpdateId = null
      lastUpdateKey = null
      lastUpdateTime = 0
      get().validate()
    }
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({
        components: history[newIndex],
        historyIndex: newIndex,
        selectedId: null,
      })
      lastUpdateId = null
      lastUpdateKey = null
      lastUpdateTime = 0
      get().validate()
    }
  },

  saveTemplate: () => {
    const { components, device, templateName } = get()
    const errors = runAllValidations(components, device)
    const canSaveResult = canSave(errors)

    if (canSaveResult) {
      const templateData = {
        name: templateName,
        components,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem('page_template_' + templateName, JSON.stringify(templateData))
    }

    return { success: canSaveResult, errors }
  },

  loadTemplate: (components) => {
    set({
      components,
      history: [components],
      historyIndex: 0,
      selectedId: null,
    })
    lastUpdateId = null
    lastUpdateKey = null
    lastUpdateTime = 0
    get().validate()
  },

  toggleValidationPanel: () => {
    set((state) => ({ showValidationPanel: !state.showValidationPanel }))
  },

  setTemplateName: (name) => set({ templateName: name }),

  validate: () => {
    const { components, device } = get()
    const errors = runAllValidations(components, device)
    set({ validationErrors: errors })
  },
}))
