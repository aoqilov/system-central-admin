import { LuFilter } from 'react-icons/lu'

export interface Filters {
  dateRange: string
  employee: string
  attraction: string
}

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
}

function Select({ label, options, value, onChange }: SelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm rounded-lg px-3 py-1.5 border outline-none focus:border-blue-500/50 cursor-pointer appearance-none"
        style={{
          background: 'var(--bg-second)',
          borderColor: 'var(--border-default)',
          color: 'var(--text-3)',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div
        className="flex items-center gap-1.5 text-xs mr-2"
        style={{ color: 'var(--text-muted)' }}
      >
        <LuFilter size={12} />
        <span>Filters</span>
      </div>

      <Select
        label="Date range"
        options={[
          { value: '7d', label: 'Last 7 days' },
          { value: '30d', label: 'Last 30 days' },
          { value: '90d', label: 'Last 3 months' },
        ]}
        value={filters.dateRange}
        onChange={v => onChange({ ...filters, dateRange: v })}
      />

      <Select
        label="Employee"
        options={[
          { value: 'all', label: 'All employees' },
          { value: 'alex', label: 'Alex Johnson' },
          { value: 'maria', label: 'Maria Garcia' },
        ]}
        value={filters.employee}
        onChange={v => onChange({ ...filters, employee: v })}
      />

      <Select
        label="Attraction"
        options={[
          { value: 'all', label: 'All attractions' },
          { value: 'roller', label: 'Roller Coaster' },
          { value: 'ferris', label: 'Ferris Wheel' },
          { value: 'water', label: 'Water Ride' },
        ]}
        value={filters.attraction}
        onChange={v => onChange({ ...filters, attraction: v })}
      />
    </div>
  )
}
