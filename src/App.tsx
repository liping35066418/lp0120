import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Editor from '@/pages/Editor'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
