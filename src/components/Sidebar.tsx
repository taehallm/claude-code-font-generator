import { Theme, TypographySettings } from '@/types'

interface SidebarProps {
  text: string
  onTextChange: (text: string) => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
  typography: TypographySettings
  onTypographyChange: (typography: Partial<TypographySettings>) => void
  glowEnabled: boolean
  onGlowChange: (enabled: boolean) => void
  transparentEnabled: boolean
  onTransparentChange: (enabled: boolean) => void
  asciiOutput: string
}

export default function Sidebar({
  text,
  onTextChange,
  theme,
  onThemeChange,
  typography,
  onTypographyChange,
  glowEnabled,
  onGlowChange,
  transparentEnabled,
  onTransparentChange,
  asciiOutput,
}: SidebarProps) {
  const downloadAsText = () => {
    if (!asciiOutput) return
    const blob = new Blob([asciiOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${text.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!asciiOutput) return
    
    try {
      await navigator.clipboard.writeText(asciiOutput)
      // Could add a toast notification here
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = asciiOutput
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const clearText = () => {
    onTextChange('')
  }

  const insertExample = () => {
    onTextChange('CLAUDE CODE')
  }

  const downloadAsPNG = () => {
    if (!asciiOutput) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get current settings
    const fontSize = typography.fontSize
    const lineHeight = typography.lineHeight
    const letterSpacing = typography.letterSpacing

    const lines = asciiOutput.split('\n')
    
    // Measure text width
    ctx.font = `${fontSize}px "Courier New", monospace`
    const actualMaxWidth = Math.max(...lines.map(line => ctx.measureText(line).width))
    
    const actualLineHeight = fontSize * lineHeight
    const padding = fontSize

    canvas.width = actualMaxWidth + padding * 2
    canvas.height = lines.length * actualLineHeight + padding * 2

    ctx.font = `${fontSize}px "Courier New", monospace`
    ctx.textBaseline = 'top'

    // Theme colors
    let textColor = '#D77757'
    let bgColor = 'transparent'

    switch (theme) {
      case 'light':
        textColor = '#D77757'
        bgColor = '#ffffff'
        break
      case 'dark':
        textColor = '#D77757'
        bgColor = '#1a1a1a'
        break
      case 'inverted-black':
        textColor = '#000000'
        bgColor = '#D77757'
        break
      case 'inverted-white':
        textColor = '#ffffff'
        bgColor = '#D77757'
        break
    }

    if (transparentEnabled) {
      bgColor = 'transparent'
    }

    // Draw background
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Apply glow effect
    if (glowEnabled) {
      ctx.shadowColor = textColor
      ctx.shadowBlur = 20
    }

    // Draw text
    ctx.fillStyle = textColor
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * actualLineHeight)
    })

    // Download
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${text.toLowerCase().replace(/\s+/g, '-')}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    })
  }

  const downloadAsSVG = () => {
    if (!asciiOutput) return

    const fontSize = typography.fontSize
    const lineHeight = typography.lineHeight
    const letterSpacing = typography.letterSpacing

    const lines = asciiOutput.split('\n')
    
    // Create temporary canvas to measure text width
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return
    
    tempCtx.font = `${fontSize}px "Courier New", monospace`
    const actualMaxWidth = Math.max(...lines.map(line => tempCtx.measureText(line).width))
    
    const actualLineHeight = fontSize * lineHeight
    const padding = fontSize

    const svgWidth = actualMaxWidth + padding * 2
    const svgHeight = lines.length * actualLineHeight + padding * 2

    // Theme colors
    let textColor = '#D77757'
    let bgColor = 'transparent'

    switch (theme) {
      case 'light':
        textColor = '#D77757'
        bgColor = '#ffffff'
        break
      case 'dark':
        textColor = '#D77757'
        bgColor = '#1a1a1a'
        break
      case 'inverted-black':
        textColor = '#000000'
        bgColor = '#D77757'
        break
      case 'inverted-white':
        textColor = '#ffffff'
        bgColor = '#D77757'
        break
    }

    if (transparentEnabled) {
      bgColor = 'transparent'
    }

    let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`

    // Background
    if (bgColor !== 'transparent') {
      svgContent += `<rect width="100%" height="100%" fill="${bgColor}"/>`
    }

    // Add glow filter if enabled
    if (glowEnabled) {
      svgContent += `<defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>`
    }

    // Render text
    lines.forEach((line, i) => {
      if (line.trim()) {
        const y = padding + i * actualLineHeight + fontSize * 0.75
        const filter = glowEnabled ? ' filter="url(#glow)"' : ''
        
        const cleanLine = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        
        svgContent += `<text x="${padding}" y="${y}" 
          font-family="Courier New, monospace" 
          font-size="${fontSize}" 
          fill="${textColor}" 
          letter-spacing="${letterSpacing}px"
          xml:space="preserve"
          style="white-space: pre;"${filter}>${cleanLine}</text>`
      }
    })

    svgContent += '</svg>'

    // Download
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${text.toLowerCase().replace(/\s+/g, '-')}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-80 min-w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Input Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Input
        </h3>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Type your text here..."
          maxLength={100}
          rows={3}
        />
        <div className="flex justify-between mt-2">
          <button
            onClick={clearText}
            className="px-3 py-1 text-sm text-gray-600 hover:text-accent transition-colors"
          >
            Clear
          </button>
          <button
            onClick={insertExample}
            className="px-3 py-1 text-sm text-gray-600 hover:text-accent transition-colors"
          >
            Example
          </button>
        </div>
      </div>

      {/* Typography Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Typography
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="24"
                value={typography.fontSize}
                onChange={(e) => onTypographyChange({ fontSize: parseInt(e.target.value) })}
                className="w-24"
              />
              <span className="text-xs font-mono text-gray-800 min-w-10 text-right">
                {typography.fontSize}px
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">Line</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.9"
                max="1.3"
                step="0.05"
                value={typography.lineHeight}
                onChange={(e) => onTypographyChange({ lineHeight: parseFloat(e.target.value) })}
                className="w-24"
              />
              <span className="text-xs font-mono text-gray-800 min-w-10 text-right">
                {typography.lineHeight}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">Letter</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={typography.letterSpacing}
                onChange={(e) => onTypographyChange({ letterSpacing: parseFloat(e.target.value) })}
                className="w-24"
              />
              <span className="text-xs font-mono text-gray-800 min-w-10 text-right">
                {typography.letterSpacing}px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Theme
        </h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['light', 'dark', 'inverted-black', 'inverted-white'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                theme === t
                  ? 'bg-accent text-white border-accent'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-accent-light hover:border-accent hover:text-accent'
              }`}
            >
              {t === 'inverted-black' ? 'Inv. Black' : 
               t === 'inverted-white' ? 'Inv. White' :
               t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Glow Effect</span>
            <button
              onClick={() => onGlowChange(!glowEnabled)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                glowEnabled 
                  ? 'bg-accent border-accent text-white' 
                  : 'border-gray-300'
              }`}
            >
              {glowEnabled && <span className="text-xs">✓</span>}
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Transparent Background</span>
            <button
              onClick={() => onTransparentChange(!transparentEnabled)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                transparentEnabled 
                  ? 'bg-accent border-accent text-white' 
                  : 'border-gray-300'
              }`}
            >
              {transparentEnabled && <span className="text-xs">✓</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="p-6 mt-auto">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Export
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={copyToClipboard}
            disabled={!asciiOutput}
            className="col-span-3 px-4 py-2 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Copy Text
          </button>
          
          <button
            onClick={downloadAsText}
            disabled={!asciiOutput}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-accent-light hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            TXT
          </button>
          
          <button
            onClick={downloadAsPNG}
            disabled={!asciiOutput}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-accent-light hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            PNG
          </button>
          
          <button
            onClick={downloadAsSVG}
            disabled={!asciiOutput}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-accent-light hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            SVG
          </button>
        </div>
      </div>
    </div>
  )
}