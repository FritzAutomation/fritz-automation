'use client'

import { useEffect, useState } from 'react'

export function TypingHero({ text, speed = 55 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return (
    <span className="font-mono">
      {shown}
      <span className="inline-block w-[0.5em] h-[0.9em] align-[-0.1em] bg-[var(--accent)] animate-pulse ml-1" />
    </span>
  )
}
