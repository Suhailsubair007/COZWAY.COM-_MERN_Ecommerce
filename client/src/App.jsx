import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminRoute from "./Routeing/AdminRoute";
import UserRoute from "./Routeing/UserRoute";
import AdminLogin from "./pages/Admin/AdminLogin";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Toaster position="bottom-center" />
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/*" element={<UserRoute />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
