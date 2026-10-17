import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { DoctorsProvider } from "./context/DoctorsContext";
import { PatientsProvider } from "./context/PatientsContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import PatientLogin from "./pages/PatientLogin";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DoctorsProvider>
          <PatientsProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/doctors/:id" element={<DoctorDetails />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/records" element={<MedicalRecords />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/patient" element={<PatientLogin />} />
                <Route path="/login/doctor" element={<DoctorLogin />} />
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </PatientsProvider>
        </DoctorsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;