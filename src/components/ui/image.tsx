import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Image as ImageIcon } from 'lucide-react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  fallbackComponent?: React.ReactNode
}

export function Image({
  className,
  src,
  alt,
  fallbackSrc,
  fallbackComponent,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt} className={className} {...props} />
    }
    if (fallbackComponent) {
      return <>{fallbackComponent}</>
    }
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-slate-100 text-slate-400 rounded-md',
          className,
        )}
        {...(props as any)}
      >
        <ImageIcon className="w-1/3 h-1/3 opacity-50" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
