# AetherCare — Smart Healthcare Appointment System

AetherCare is a role-based healthcare appointment platform built with React. It lets patients discover doctors and book appointments, lets doctors manage their availability and schedule, and gives admins full visibility into doctors, time slots, and bookings.

This is a front-end implementation with all data persisted in the browser (`localStorage`) — there is no backend server or database yet. See [Future Scope](#future-scope) for what a production version would add.

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL that Vite prints in the terminal.

To build for production:

```bash
npm run build
npm run preview
```

## User Roles

### Patient
- Sign up / sign in with a name and password
- Browse and search doctors by name or filter by speciality
- Jump straight to a speciality's doctors from the homepage
- View a doctor's profile (experience, fee, availability, time slots)
- Book an appointment (date, time, reason) — booking a slot that's already taken by another patient is blocked automatically
- View and cancel their own upcoming appointments
- View and edit their profile (contact details, blood group)
- View sample medical records and lab reports

### Doctor
- Sign up by choosing a speciality and setting a name, password, years of experience, and consultation fee
- Sign in to a personal dashboard
- Toggle availability / mark themselves on leave
- View their appointment schedule, organised by time slot
- Remove their own profile

### Admin
- Sign in with dedicated admin credentials  
  **Username:** `AetherCare` · **Password:** `AetherCare`
- View every doctor on the platform in one place, with available doctors listed first and unavailable/on-leave doctors grouped at the bottom
- View each doctor's time slots and exactly which patient has booked each one
- View at-a-glance stats: total doctors, total appointments, and doctors currently on leave

## Tech Stack

- **React 18** with **Vite**
- **React Router** for client-side routing and role-specific views
- **React Context** for auth, doctor, and patient state
- A custom `useLocalStorage` hook for persisting state across sessions
- Plain CSS, written mobile-first and fully responsive

## Project Structure

```
src/
  components/   Reusable UI (Navbar, Footer, DoctorCard, AppointmentCard, ...)
  context/      AuthContext, DoctorsContext, PatientsContext
  data/         Seed data for doctors and sample medical records
  hooks/        useLocalStorage
  pages/        Route-level views (Home, Doctors, BookAppointment, Admin dashboard, ...)
```

## Known Limitations

- All data lives in the browser's `localStorage`; clearing site data or switching devices resets it
- Passwords are stored as plain text locally — this is not a production-safe auth model
- Medical records shown to patients are static sample data, not yet linked to real appointments or prescriptions

## Future Scope

Planned for a production-ready version, backed by a real server and database:

- Persistent backend (Node/Express or similar) with a proper database for patients, doctors, appointments, prescriptions, medical records, and payments
- Secure authentication (hashed passwords, sessions/JWT)
- Digital prescriptions issued by doctors and viewable by patients
- Medicine reminder notifications
- Lab report upload and storage
- Online payments (initially simulated, later integrated with a real payment gateway)
- Admin analytics: disease statistics and appointment trends dashboard
- Automated email reminders for upcoming appointments

## Disclaimer

AetherCare is a demonstration project. It does not process real medical information or real payments.
