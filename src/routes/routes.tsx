import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const LiveMonitor = lazy(() => import('../pages/LiveMonitor'))
const Employees = lazy(() => import('../pages/Employees'))
const EmployeeDetail = lazy(() => import('../pages/EmployeeDetail'))
const Attractions = lazy(() => import('../pages/Attractions'))
const AttractionDetail = lazy(() => import('../pages/AttractionDetail'))
const Kassa = lazy(() => import('../pages/Kassa'))
const KassaDetail = lazy(() => import('../pages/KassaDetail'))
const Reports = lazy(() => import('../pages/Reports'))
const Settings = lazy(() => import('../pages/Settings'))
const Support = lazy(() => import('../pages/Support'))
const Login = lazy(() => import('../pages/Login'))
const NotFound = lazy(() => import('../pages/NotFound'))

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/live-monitor', element: <LiveMonitor /> },
      { path: '/employees', element: <Employees /> },
      { path: '/employee/:id', element: <EmployeeDetail /> },
      { path: '/attractions', element: <Attractions /> },
      { path: '/attraction/:id', element: <AttractionDetail /> },
      { path: '/kassa', element: <Kassa /> },
      { path: '/kassa/:id', element: <KassaDetail /> },
      { path: '/reports', element: <Reports /> },
      { path: '/settings', element: <Settings /> },
      { path: '/support', element: <Support /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '*', element: <NotFound /> },
]
