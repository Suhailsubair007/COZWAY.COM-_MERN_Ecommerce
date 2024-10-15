import { Routes, Route } from 'react-router-dom'
import Signup from '../pages/User/login/Signup'
import Login from '../pages/User/login/Login'
import { Toaster } from '@/components/ui/sonner'
import Landing from '../pages/User/HomePage/Landing'

const UserRoute = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/landing' element={<Landing />} />
      </Routes>
      <Toaster position='bottom-center' />
    </div>
  )
}

export default UserRoute
