import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const PatientsContext = createContext(null);

const normalizeName = (name) => name.trim().toLowerCase();

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useLocalStorage("aethercarePatients", []);

  const findPatientByName = (name) =>
    patients.find((p) => normalizeName(p.name) === normalizeName(name));

  const getPatient = (patientId) =>
    patients.find((p) => p.id === Number(patientId));

  // Creates a new patient account (used when someone signs up as a patient).
  const addPatient = ({ name, password }) => {
    const nextId = patients.length ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
    const newPatient = {
      id: nextId,
      name: name.trim(),
      password,
      email: "",
      phone: "",
      age: "",
      bloodGroup: "O+"
    };
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (patientId, updates) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, ...updates } : p))
    );
  };

  return (
    <PatientsContext.Provider
      value={{ patients, findPatientByName, getPatient, addPatient, updatePatient }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) {
    throw new Error("usePatients must be used within a PatientsProvider");
  }
  return ctx;
}
