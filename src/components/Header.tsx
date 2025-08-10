interface HeaderProps {
  textLength: number
}

export default function Header({ textLength }: HeaderProps) {
  return (
    <div className="h-14 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-6">
      <div className="text-lg font-semibold text-accent">
        Claude Code Font Generator
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm italic text-gray-500">
          Generate text in Claude Code styling font using ANSI Shadow ASCII art
        </span>
        <span className="text-xs text-gray-400">
          {textLength} / 100
        </span>
      </div>
    </div>
  )
}