import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div className="bg-background text-on-background font-body antialiased selection:bg-primary-container selection:text-on-primary">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
          <Header />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
