import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from './pages/User/login/Signup'
import Login from './pages/User/login/Login'
import { Toaster } from '@/components/ui/sonner'
import Landing from './pages/User/HomePage/Landing'
import AdminDashbord from './pages/Admin/AdminDasboard'
import AdminLogin from './pages/Admin/AdminLogin'
import AddCategory from './pages/Admin/AddCategory'
import AddProduct from './pages/Admin/AddProduct'
import Product from './pages/Admin/Product'
import EditCategory from './pages/Admin/EditCategory'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/landing' element={<Landing />} />
          <Route path='/admin/dashboard' element={<AdminDashbord />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/categories' element={<AddCategory/>} />
          <Route path='/admin/dashboard/product/addproduct' element={<AddProduct/>} />
          <Route path='/admin/dashboard/product' element={<Product/>} />
          <Route path='/admin/categories/edit/:categoryId' element={<EditCategory/>} />
        </Routes>
      </div>
      <Toaster position='bottom-center' />
    </Router>
  )
}

export default App
