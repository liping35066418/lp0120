import React, { useEffect } from 'react'
import Toolbar from '@/components/editor/Toolbar'
import ComponentPanel from '@/components/editor/ComponentPanel'
import Canvas from '@/components/editor/Canvas'
import PropertyPanel from '@/components/editor/PropertyPanel'
import ValidationHint from '@/components/editor/ValidationHint'
import { useEditorStore } from '@/store/editorStore'

const EditorPage: React.FC = () => {
  const { validate, showValidationPanel } = useEditorStore()

  useEffect(() => {
    validate()
  }, [validate])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden relative">
        <ComponentPanel />
        <Canvas />
        <PropertyPanel />
        <ValidationHint />
      </div>
    </div>
  )
}

export default EditorPage
