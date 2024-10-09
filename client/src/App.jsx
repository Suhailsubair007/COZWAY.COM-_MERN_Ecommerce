import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from './pages/login/Signup'
import Login from './pages/login/Login'
import Otpsignin from './pages/login/Otpsignin'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/otpsignin' element={<Otpsignin />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
