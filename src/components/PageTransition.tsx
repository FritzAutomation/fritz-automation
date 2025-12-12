'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // When pathname changes, fade out then update children
    setIsVisible(false)

    const timeout = setTimeout(() => {
      setDisplayChildren(children)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timeout)
  }, [pathname, children])

  return (
    <div
      className={`transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {displayChildren}
    </div>
  )
}
