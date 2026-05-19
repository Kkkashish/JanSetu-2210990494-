import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPage from "./pages/PublicPage";
import UserDashboard from "./pages/UserDashboard";
import FileComplaint from "./pages/FileComplaint";
import ComplaintSuccess from "./pages/ComplaintSuccess";
import TrackComplaint from "./pages/TrackComplaint";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPage />} />

        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        > 
          <Route path="file-complaint" element={<FileComplaint />} />
          <Route path="file-complaint/complaint-success/:id" element={<ComplaintSuccess />} />
          <Route path="track-complaint" element={<TrackComplaint />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;