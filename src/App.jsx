import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { DoctorsProvider } from "./context/DoctorsContext";
import { PatientsProvider } from "./context/PatientsContext";
import { ToastProvider } from "./context/ToastContext";
import AppLayout from "./components/AppLayout";
import RequireRole from "./components/RequireRole";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import HealthInfo from "./pages/HealthInfo";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import PatientLogin from "./pages/PatientLogin";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Global state in this app:
//   Context API  -> theme, signed-in user, doctor + patient directories, toast messages
//   Redux Toolkit -> the shared appointment list (see src/store). Its <Provider> is in main.jsx.
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DoctorsProvider>
          <PatientsProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  {/* AppLayout draws the Navbar and Footer around every child route. */}
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/doctors/:id" element={<DoctorDetails />} />
                    <Route path="/book-appointment" element={<BookAppointment />} />
                    <Route
                      path="/appointments"
                      element={
                        <RequireRole role="patient" action="view your appointments">
                          <Appointments />
                        </RequireRole>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <RequireRole role="patient" action="see your dashboard">
                          <Dashboard />
                        </RequireRole>
                      }
                    />
                    <Route path="/records" element={<MedicalRecords />} />
                    <Route path="/health-info" element={<HealthInfo />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/patient" element={<PatientLogin />} />
                    <Route path="/login/doctor" element={<DoctorLogin />} />
                    <Route path="/doctor" element={<DoctorDashboard />} />
                    <Route path="/login/admin" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </PatientsProvider>
        </DoctorsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
