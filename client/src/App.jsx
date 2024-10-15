import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AdminRoute from './Routeing/AdminRoute'
import UserRoute from './Routeing/UserRoute'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/admin/*' element={<AdminRoute />} />
        <Route path='/*' element={<UserRoute />} />
      </Routes>
    </Router>
  )
}

export default App
