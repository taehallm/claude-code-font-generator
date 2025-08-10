'use client'

import React, { useState, useCallback } from 'react'
import { generateAsciiArt } from '@/lib/ansi-font'
import { Theme, TypographySettings } from '@/types'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Preview from '@/components/Preview'

export default function Home() {
  const [text, setText] = useState('CLAUDE CODE')
  const [theme, setTheme] = useState<Theme>('light')
  const [typography, setTypography] = useState<TypographySettings>({
    fontSize: 16,
    lineHeight: 1.0,
    letterSpacing: -0.5
  })
  const [glowEnabled, setGlowEnabled] = useState(false)
  const [transparentEnabled, setTransparentEnabled] = useState(false)
  const [asciiOutput, setAsciiOutput] = useState('')

  const generateOutput = useCallback(() => {
    if (text.trim()) {
      const output = generateAsciiArt(text)
      setAsciiOutput(output)
    } else {
      setAsciiOutput('')
    }
  }, [text])

  // Generate initial output
  React.useEffect(() => {
    generateOutput()
  }, [generateOutput])

  const handleTextChange = (newText: string) => {
    setText(newText)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const handleTypographyChange = (newTypography: Partial<TypographySettings>) => {
    setTypography(prev => ({ ...prev, ...newTypography }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header textLength={text.length} />
      
      <div className="flex h-[calc(100vh-56px)]">
        <Sidebar
          text={text}
          onTextChange={handleTextChange}
          theme={theme}
          onThemeChange={handleThemeChange}
          typography={typography}
          onTypographyChange={handleTypographyChange}
          glowEnabled={glowEnabled}
          onGlowChange={setGlowEnabled}
          transparentEnabled={transparentEnabled}
          onTransparentChange={setTransparentEnabled}
          asciiOutput={asciiOutput}
        />
        
        <Preview
          asciiOutput={asciiOutput}
          theme={theme}
          typography={typography}
          glowEnabled={glowEnabled}
          transparentEnabled={transparentEnabled}
        />
      </div>
    </div>
  )
}