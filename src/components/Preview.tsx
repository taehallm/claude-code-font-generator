import { Theme, TypographySettings } from '@/types'

interface PreviewProps {
  asciiOutput: string
  theme: Theme
  typography: TypographySettings
  glowEnabled: boolean
  transparentEnabled: boolean
}

export default function Preview({
  asciiOutput,
  theme,
  typography,
  glowEnabled,
  transparentEnabled,
}: PreviewProps) {
  const getThemeStyles = () => {
    let textColor = '#D77757'
    let previewContainerBg = '#f8f9fa'
    let mainAreaBg = 'bg-white'

    switch (theme) {
      case 'light':
        textColor = '#D77757'
        previewContainerBg = '#ffffff'
        mainAreaBg = 'bg-white'
        break
      case 'dark':
        textColor = '#D77757'
        previewContainerBg = '#1a1a1a'
        mainAreaBg = 'bg-white'
        break
      case 'inverted-black':
        textColor = '#000000'
        previewContainerBg = '#D77757'
        mainAreaBg = 'bg-white'
        break
      case 'inverted-white':
        textColor = '#ffffff'
        previewContainerBg = '#D77757'
        mainAreaBg = 'bg-white'
        break
    }

    // Handle transparent background - use checkerboard pattern for transparency
    let backgroundColor = previewContainerBg
    let borderStyle = 'border-gray-200'
    let useTransparencyGrid = false
    
    if (transparentEnabled) {
      backgroundColor = 'transparent'
      borderStyle = 'border-dashed border-gray-300'
      useTransparencyGrid = true
      
      // Keep original text colors for transparent mode - don't override them
      // This way inverted themes keep their intended text colors
    }

    return { textColor, backgroundColor, borderStyle, mainAreaBg, useTransparencyGrid }
  }

  const { textColor, backgroundColor, borderStyle, mainAreaBg, useTransparencyGrid } = getThemeStyles()

  const textStyle = {
    fontSize: `${typography.fontSize}px`,
    lineHeight: typography.lineHeight,
    letterSpacing: `${typography.letterSpacing}px`,
    color: textColor,
    backgroundColor,
    textShadow: glowEnabled 
      ? `0 0 10px ${textColor}, 0 0 20px ${textColor}, 0 0 30px ${textColor}`
      : 'none',
  }

  return (
    <div className={`flex-1 flex items-center justify-center min-w-0 overflow-hidden ${mainAreaBg}`}>
      <div 
        className={`border rounded-lg p-8 max-w-[90%] max-h-[80%] overflow-auto shadow-lg transition-all duration-300 ${borderStyle} relative`}
        style={{ 
          backgroundColor: useTransparencyGrid ? 'transparent' : backgroundColor,
          backgroundImage: useTransparencyGrid 
            ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)'
            : 'none',
          backgroundSize: useTransparencyGrid ? '20px 20px' : 'auto',
          backgroundPosition: useTransparencyGrid ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'auto'
        }}
      >
        <div 
          className="relative z-10"
          style={{ backgroundColor: useTransparencyGrid ? backgroundColor : 'transparent' }}
        >
          <pre
            className="font-mono whitespace-pre transition-all duration-300"
            style={textStyle}
          >
            {asciiOutput || (
              <span 
                className="italic text-sm" 
                style={{ 
                  color: useTransparencyGrid ? '#9aa0a6' : // Transparent mode - always use neutral gray
                         theme === 'dark' ? '#9aa0a6' : 
                         theme === 'inverted-black' ? '#00000080' :
                         theme === 'inverted-white' ? '#ffffff80' :
                         '#9aa0a6' 
                }}
              >
                Type text in the sidebar to generate ASCII art
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}