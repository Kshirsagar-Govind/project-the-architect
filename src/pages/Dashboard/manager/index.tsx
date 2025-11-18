import React from 'react'
import LeftNav from '../../../components/navigations/leftNav'
import ManagerDashboardPage from './dashboardPage'

export default function ManagerDashboard() {
  return (
    <React.Fragment>
      <LeftNav />
      <ManagerDashboardPage />
    </React.Fragment>
  )
}
