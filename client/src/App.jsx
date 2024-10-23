import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminRoute from "./Routeing/AdminRoute";
import UserRoute from "./Routeing/UserRoute";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminProtect from "./Routeing/Protected_Routing/admin/adminProtect";
import AdminLoginProtect from "./Routeing/Protected_Routing/admin/adminLoginProtect";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminLoginProtect>
              <AdminLogin />
            </AdminLoginProtect>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminProtect>
              <AdminRoute />
            </AdminProtect>
          }
        />
        <Route path="/*" element={<UserRoute />} />
      </Routes>
    </Router>
  );
};

export default App;