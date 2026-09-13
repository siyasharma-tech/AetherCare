import { createContext, useContext, useEffect } from "react";
import baseDoctors from "../data/doctors";
import useLocalStorage from "../hooks/useLocalStorage";

const DoctorsContext = createContext(null);

// A doctor is bookable only while they're marked available AND not on leave.
export function isDoctorBookable(doctor) {
  return Boolean(doctor.available) && !doctor.onLeave;
}

export function DoctorsProvider({ children }) {
  const [doctors, setDoctors] = useLocalStorage("aethercareDoctors", baseDoctors);

  // Backfill a default password for any doctor saved before passwords existed
  // (e.g. from an older version of this app already stored in the browser).
  useEffect(() => {
    const needsFix = doctors.some((doc) => !doc.password);
    if (needsFix) {
      setDoctors((prev) =>
        prev.map((doc) => (doc.password ? doc : { ...doc, password: "AetherCare" }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLeave = (doctorId) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, onLeave: !doc.onLeave } : doc))
    );
  };

  const addTiming = (doctorId, time) => {
    const clean = time.trim();
    if (!clean) return;

    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === doctorId && !doc.timings.includes(clean)
          ? { ...doc, timings: [...doc.timings, clean] }
          : doc
      )
    );
  };

  const removeTiming = (doctorId, time) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === doctorId ? { ...doc, timings: doc.timings.filter((t) => t !== time) } : doc
      )
    );
  };

  const getDoctor = (doctorId) => doctors.find((doc) => doc.id === Number(doctorId));

  // Creates a brand-new doctor profile (used when someone signs up as a doctor).
  const addDoctor = ({ name, specialty, password, experience, fee }) => {
    const nextId = doctors.length ? Math.max(...doctors.map((d) => d.id)) + 1 : 1;
    const newDoctor = {
      id: nextId,
      name,
      specialty,
      password,
      experience: Number(experience) || 0,
      rating: 0,
      available: true,
      onLeave: false,
      fee: Number(fee) || 0,
      timings: [],
      about: `New ${specialty.toLowerCase()} on AetherCare.`
    };

    setDoctors((prev) => [...prev, newDoctor]);
    return newDoctor;
  };

  // Permanently removes a doctor's own profile (used from the doctor dashboard).
  const removeDoctor = (doctorId) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== doctorId));
  };

  return (
    <DoctorsContext.Provider value={{ doctors, toggleLeave, addTiming, removeTiming, getDoctor, addDoctor, removeDoctor }}>
      {children}
    </DoctorsContext.Provider>
  );
}

export function useDoctors() {
  const ctx = useContext(DoctorsContext);
  if (!ctx) {
    throw new Error("useDoctors must be used within a DoctorsProvider");
  }
  return ctx;
}
