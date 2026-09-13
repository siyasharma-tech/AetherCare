import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

export const ROLE_LABELS = {
  patient: "Patient",
  doctor: "Doctor",
  admin: "Admin",
};

// Admin credentials for this application.
export const ADMIN_CREDENTIALS = {
  username: "AetherCare",
  password: "AetherCare",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("aethercareAuth", null);

  const login = (role, id) =>
    setUser(
      role === "doctor"
        ? { role, doctorId: id }
        : role === "patient"
        ? { role, patientId: id }
        : { role }
    );
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
