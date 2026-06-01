import { LuSquareMousePointer } from 'react-icons/lu'
import { InnerLayout } from '../components/layout/InnerLayout'
import { HwtButton } from '../components/structura-pages/dev-ui/HwtButton'

export default function DevUI() {
  return (
    <div>
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
          Developer
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-default)' }}>
          UI Components
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Component reference and usage examples for ParkOps.
        </p>
      </div>

      <InnerLayout
        sections={[
          {
            id: 'button',
            label: 'CusButton',
            icon: LuSquareMousePointer,
            content: <HwtButton />,
          },
        ]}
      />
    </div>
  )
}
