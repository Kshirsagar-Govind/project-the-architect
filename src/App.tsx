import AllRoutes from './routes';
import {NavigationProvider} from './contexts/navigation/navigationProvider'
import './index.css'
function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationProvider>
        <AllRoutes/>
      </NavigationProvider>
    </div>
  )
}

export default App
