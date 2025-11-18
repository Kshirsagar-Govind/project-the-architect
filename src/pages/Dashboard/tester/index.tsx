import React from 'react'
import LeftNav from '../../../components/navigations/leftNav'
import MemberDashboardPage from './dashboardPage'

export default function MemberDashboard() {
  return (
    <React.Fragment>
      <LeftNav />
      <MemberDashboardPage />
    </React.Fragment>
  )
}
