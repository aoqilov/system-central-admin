import { useState } from 'react'
import {
  LuMoon,
  LuBell,
  LuMail,
  LuSmartphone,
  LuFileText,
  LuDoorOpen,
  LuWrench,
  LuUsers,
  LuTriangleAlert,
  LuSave,
  LuRefreshCw,
  LuMonitor,
} from 'react-icons/lu'
import { useTheme } from '../context/ThemeContext'

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: 40,
        height: 22,
        background: on ? '#3b82f6' : 'var(--border-2)',
      }}
    >
      <span
        className="absolute top-0.5 rounded-full bg-white shadow transition-transform duration-200"
        style={{
          width: 18,
          height: 18,
          transform: on ? 'translateX(20px)' : 'translateX(2px)',
        }}
      />
    </button>
  )
}

function SettingRow({
  icon: Icon,
  iconColor = '#3b82f6',
  label,
  description,
  checked,
  onChange,
  last = false,
}: {
  icon: React.ElementType
  iconColor?: string
  label: string
  description: string
  checked: boolean
  onChange: () => void
  last?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between py-3.5 gap-4"
      style={last ? {} : { borderBottom: '1px solid var(--border-default)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            {label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        </div>
      </div>
      <Switch on={checked} onToggle={onChange} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--bg-second)', borderColor: 'var(--border-default)' }}
    >
      <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-default)' }}>
          {title}
        </p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { theme, toggle } = useTheme()

  const [notif, setNotif] = useState({
    sound: true,
    email: false,
    push: true,
    dailyReport: true,
  })

  const [ops, setOps] = useState({
    autoClose: true,
    maintenance: false,
    guestCheckin: true,
    capacityAlert: true,
  })

  const [sys, setSys] = useState({
    autoSave: true,
    dataSync: true,
  })

  const toggle2 = <T extends object>(obj: T, setter: React.Dispatch<React.SetStateAction<T>>, key: keyof T) =>
    setter(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="p-4 tablet:p-6 space-y-4 max-w-2xl">
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>System</p>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-default)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Park preferences and system configuration.
        </p>
      </div>

      {/* Appearance */}
      <Section title="Appearance">
        <SettingRow
          icon={LuMoon}
          iconColor="#8b5cf6"
          label="Dark mode"
          description="Use dark theme across the dashboard"
          checked={theme === 'dark'}
          onChange={toggle}
          last
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SettingRow
          icon={LuBell}
          iconColor="#3b82f6"
          label="Alert sound"
          description="Play sound for critical alerts"
          checked={notif.sound}
          onChange={() => toggle2(notif, setNotif, 'sound')}
        />
        <SettingRow
          icon={LuMail}
          iconColor="#06b6d4"
          label="Email alerts"
          description="Send important events to your email"
          checked={notif.email}
          onChange={() => toggle2(notif, setNotif, 'email')}
        />
        <SettingRow
          icon={LuSmartphone}
          iconColor="#22c55e"
          label="Push notifications"
          description="Receive alerts on mobile"
          checked={notif.push}
          onChange={() => toggle2(notif, setNotif, 'push')}
        />
        <SettingRow
          icon={LuFileText}
          iconColor="#eab308"
          label="Daily report"
          description="Auto-send daily summary at 23:00"
          checked={notif.dailyReport}
          onChange={() => toggle2(notif, setNotif, 'dailyReport')}
          last
        />
      </Section>

      {/* Park Operations */}
      <Section title="Park Operations">
        <SettingRow
          icon={LuDoorOpen}
          iconColor="#3b82f6"
          label="Auto-close gates"
          description="Automatically lock gates at closing time"
          checked={ops.autoClose}
          onChange={() => toggle2(ops, setOps, 'autoClose')}
        />
        <SettingRow
          icon={LuWrench}
          iconColor="#ef4444"
          label="Maintenance mode"
          description="Pause all operations and notify staff"
          checked={ops.maintenance}
          onChange={() => toggle2(ops, setOps, 'maintenance')}
        />
        <SettingRow
          icon={LuUsers}
          iconColor="#22c55e"
          label="Guest check-in"
          description="Allow QR-based guest check-in at entrance"
          checked={ops.guestCheckin}
          onChange={() => toggle2(ops, setOps, 'guestCheckin')}
        />
        <SettingRow
          icon={LuTriangleAlert}
          iconColor="#eab308"
          label="Capacity alerts"
          description="Warn when attraction reaches 90% capacity"
          checked={ops.capacityAlert}
          onChange={() => toggle2(ops, setOps, 'capacityAlert')}
          last
        />
      </Section>

      {/* System */}
      <Section title="System">
        <SettingRow
          icon={LuSave}
          iconColor="#3b82f6"
          label="Auto-save"
          description="Automatically save changes every 5 minutes"
          checked={sys.autoSave}
          onChange={() => toggle2(sys, setSys, 'autoSave')}
        />
        <SettingRow
          icon={LuRefreshCw}
          iconColor="#06b6d4"
          label="Data sync"
          description="Sync data with server in real time"
          checked={sys.dataSync}
          onChange={() => toggle2(sys, setSys, 'dataSync')}
          last
        />
      </Section>

      {/* Version */}
      <div className="flex items-center gap-2 pt-1" style={{ color: 'var(--text-dim)' }}>
        <LuMonitor size={12} />
        <p className="text-xs">ParkOps Control Center v1.0.0</p>
      </div>
    </div>
  )
}
