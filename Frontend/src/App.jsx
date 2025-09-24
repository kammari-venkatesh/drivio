import React from 'react'
import './App.css'
import LoginPage from './Components/Loginpage/Loginpage.jsx'
import UserDashboard from './Components/UserDashbooard/UserDashboard.jsx'
import CustomerDelivery from './Components/customerDelivery/CostumerDelivery.jsx'
import DriverRequest from './Components/Driverrequestboard/Driverrequest.jsx'
import DriverAcceptPage from './Components/DriverAcceppage/DriverAcceptpage.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import AdminDashboard from './Components/Admindashboard/Admindashboard.jsx'
function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/userdashboard' element={<UserDashboard />} />
          <Route path='/admindashboard' element={<AdminDashboard />} />
          <Route path='/customerdelivery' element={<CustomerDelivery />} />
          <Route path='/driverrequest' element={<DriverRequest />} />
          <Route path='/driveracceptpage' element={<DriverAcceptPage />} />
        </Routes>
      </BrowserRouter>
  
    </div>
  )
}

export default App
