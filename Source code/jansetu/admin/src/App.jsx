import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ComplaintDetails from "./pages/ComplaintDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AdminLogin />} />

        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path=":id" element={<ComplaintDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;