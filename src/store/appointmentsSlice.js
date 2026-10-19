// ---------------------------------------------------------------
// Redux Toolkit "slice" for appointments.
//
// A slice bundles three things in one place:
//   1. the initial state
//   2. reducers  (functions that change the state)
//   3. the action creators Redux Toolkit generates from those reducers
// Selectors (functions that read the state) are exported below it.
// ---------------------------------------------------------------
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { STATUS, isCancelled } from "../utils/appointments";

export const STORAGE_KEY = "aethercareAppointments";

// Same key and shape the app has always used, so bookings saved by the
// older version of AetherCare still load.
function loadAppointments() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: { items: loadAppointments() },
  reducers: {
    // "prepare" builds the full appointment (id, status, timestamp) so the
    // component only has to send the form values.
    addAppointment: {
      reducer(state, action) {
        state.items.push(action.payload); // Redux Toolkit lets us "mutate" safely
      },
      prepare(details) {
        return {
          payload: { ...details, id: Date.now(), status: STATUS.CONFIRMED, createdAt: Date.now() }
        };
      }
    },

    // Cancelling keeps the record (so the patient can see it) but frees the slot.
    cancelAppointment(state, action) {
      const appointment = state.items.find((item) => item.id === action.payload);
      if (appointment && !isCancelled(appointment)) {
        appointment.status = STATUS.CANCELLED;
        appointment.cancelledAt = Date.now();
      }
    },

    // Permanently deletes a record (used from the "Cancelled" history).
    removeAppointment(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    }
  }
});

export const { addAppointment, cancelAppointment, removeAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;

// ---- Selectors ------------------------------------------------------
// Components call useSelector(selectSomething) instead of reaching into
// the state shape themselves. createSelector remembers its last result,
// so the filtered lists are only rebuilt when the data really changes.

export const selectAllAppointments = (state) => state.appointments.items;

// Everything except cancelled bookings: these are the ones that hold a slot.
export const selectActiveAppointments = createSelector([selectAllAppointments], (items) =>
  items.filter((item) => !isCancelled(item))
);

export const selectAppointmentsByPatient = createSelector(
  [selectAllAppointments, (_state, patientId) => patientId],
  (items, patientId) => items.filter((item) => item.patientId === patientId)
);

export const selectActiveAppointmentsByDoctor = createSelector(
  [selectActiveAppointments, (_state, doctorId) => doctorId],
  (items, doctorId) => items.filter((item) => item.doctorId === doctorId)
);
