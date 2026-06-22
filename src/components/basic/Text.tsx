import React from 'react'

interface TextProps {
  content?: string
  fontSize?: string
  color?: string
  fontWeight?: string
  styles?: Record<string, string>
  children?: React.ReactNode
}

const BasicText: React.FC<TextProps> = ({
  content = '文本内容',
  fontSize = '14px',
  color = '#333333',
  fontWeight = 'normal',
  styles = {},
}) => {
  return (
    <p
      className="leading-relaxed"
      style={{
        fontSize,
        color,
        fontWeight,
        ...styles,
      }}
    >
      {content}
    </p>
  )
}

export default BasicText
