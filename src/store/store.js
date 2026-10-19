import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer, { STORAGE_KEY } from "./appointmentsSlice";

// The store is the single object that holds the whole Redux state tree.
export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer
  }
});

// Save to localStorage whenever the appointments change, so bookings
// survive a page refresh. (localStorage is demo storage: it lives only in
// this browser and is not a real database.)
let lastSaved = store.getState().appointments.items;
store.subscribe(() => {
  const current = store.getState().appointments.items;
  if (current === lastSaved) return;
  lastSaved = current;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Storage can be full or blocked; the app keeps working in memory.
  }
});
