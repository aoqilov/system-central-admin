import { useState } from 'react'
import { LuDownload, LuCheck } from 'react-icons/lu'

interface ExportButtonProps {
  onClick?: () => void
}

export default function ExportButton({ onClick }: ExportButtonProps) {
  const [done, setDone] = useState<boolean>(false)

  function handleClick() {
    onClick?.()
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
      style={{ background: done ? '#22c55e' : '#3b82f6' }}
    >
      {done ? (
        <>
          <LuCheck size={14} /> Exported
        </>
      ) : (
        <>
          <LuDownload size={14} /> Export CSV
        </>
      )}
    </button>
  )
}
