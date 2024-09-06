import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/general/navBar'
import RoutingArea from './components/general/navigations/routingArea'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <RoutingArea/>
      </BrowserRouter>
    </>
  )
}

export default App
