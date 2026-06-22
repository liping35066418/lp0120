import React from 'react'

interface ImageProps {
  src?: string
  alt?: string
  width?: string
  borderRadius?: string
  fit?: 'cover' | 'contain' | 'fill' | 'none'
  styles?: Record<string, string>
}

const BasicImage: React.FC<ImageProps> = ({
  src = '',
  alt = '图片',
  width = '100%',
  borderRadius = '8px',
  fit = 'cover',
  styles = {},
}) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        borderRadius,
        objectFit: fit,
        ...styles,
      }}
      className="max-w-full"
    />
  )
}

export default BasicImage
