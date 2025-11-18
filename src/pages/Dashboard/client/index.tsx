import React from 'react'
import LeftNav from '../../../components/navigations/leftNav'
import DashboardPage from './dashboardPage'

export default function ClientDashboard() {
  return (
    <React.Fragment>
      <LeftNav />
      <DashboardPage />
    </React.Fragment>
  )
}
