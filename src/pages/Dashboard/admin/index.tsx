import React from 'react'
import LeftNav from '../../../components/navigations/leftNav'
import AdminDashboardPage from './dashboardPage'

export default function AdminDashboard() {
  return (
    <React.Fragment>
      <LeftNav />
      <AdminDashboardPage />
    </React.Fragment>
  )
}
