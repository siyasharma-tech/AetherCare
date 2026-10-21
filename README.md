# AetherCare — Smart Healthcare Appointment System

AetherCare is a role-based healthcare appointment platform built with React. It lets patients discover doctors and book appointments, lets doctors manage their availability and schedule, and gives admins full visibility into doctors, time slots, and bookings.

This is a front-end implementation with all data persisted in the browser (`localStorage`) — there is no backend server or database yet. See [Future Scope](#future-scope) for what a production version would add.

## Installation and Running

**Requirements:** [Node.js](https://nodejs.org) 18 or newer (which includes npm).

```bash
# 1. Unzip the project, then open a terminal inside the aethercare folder
cd aethercare

# 2. Install the dependencies (React, React Router, Redux Toolkit, react-redux, Vite)
npm install

# 3. Start the development server
npm run dev
```

Open the local URL that Vite prints (normally http://localhost:5173).

To create and try a production build:

```bash
npm run build
npm run preview
```

On Windows you can also double-click `setup-and-run.bat`. It does a clean reinstall and then starts the dev server.

**Try it quickly:** sign up as a patient (Login → Patient → Sign up, password of 4+ characters), open a doctor,
book an appointment, then look at the Dashboard and Appointments pages. Doctor demo accounts use the password
`AetherCare` (for example *Arjun Kapoor* under *General Physician*), and the admin login is listed below.

**For college evaluation:** see [EVALUATION_GUIDE.md](EVALUATION_GUIDE.md) for the syllabus mapping, a demo sequence and viva questions with answers based on this code.

## What's New in This Version

| Area | What was added |
|---|---|
| **Patient Dashboard** (`/dashboard`) | Stat cards, next appointment, upcoming list, recent activity, quick actions and doctors available to book. Built from the patient's real bookings. |
| **Appointments** | Status labels (Confirmed, Past, Cancelled), tabs with counts, search, a confirmation dialog before cancelling, and a way to remove cancelled records. Cancelling now frees the time slot. |
| **Health Info** (`/health-info`) | Tips loaded with `fetch` + `async/await`, with a loading spinner, an error message, a **Try again** button, plus search and a topic filter. |
| **Contact & Support** (`/contact`) | Validated support form, an FAQ accordion and a list of messages saved on this device. |
| **Reusable forms** | `TextField`, `SelectField`, `TextAreaField`, a `useForm` hook and a `validators.js` rule set, used by the booking, profile, patient sign-in and contact forms. |
| **Doctor dashboard** | A new "Your booked appointments" section, so doctors can see who has booked them. |
| **Layout and UX** | Shared `AppLayout` (navbar and footer), a `RequireRole` route guard, toast messages, a skip-to-content link, and consistent loading, empty and error states. |

### Things that behave differently from before

- **Cancelling an appointment** no longer deletes it. It becomes *Cancelled* (and the slot is released). Cancelled items can then be removed from history.
- **Signing in as a patient** now goes to the Dashboard (sign-up still goes to Profile).
- **Booking reason** must be at least 10 characters; **patient sign-up passwords** must be at least 4 characters.
- The navbar switches to the hamburger menu below 1200px wide (it was 900px) because it now has more links.
- The admin stat "Total appointments" is now **Active appointments** (cancelled bookings are not counted).
- **All styling is now plain CSS.** The SCSS files were converted to equivalent `.css` files; the `sass` package is no longer needed. Colours and sizes are CSS variables (for example `var(--teal)`), defined in `src/styles/tokens.css`.
- Bookings saved by the earlier version still load, because the same `localStorage` key and data shape are used.

## Light and Dark Theme

A toggle in the navbar switches between light and dark. The choice is saved, and on a first visit it follows the operating system setting. The change plays as a circular reveal that grows from the toggle button (using the browser's View Transitions API, with a plain colour fade where that isn't supported, and no animation when reduced motion is requested).

## User Roles

### Patient
- Sign up / sign in with a name and password
- Browse and search doctors by name or filter by speciality
- Jump straight to a speciality's doctors from the homepage
- View a doctor's profile (experience, fee, availability, time slots)
- Book an appointment (date, time, reason) — booking a slot that's already taken by another patient is blocked automatically
- See a personal dashboard with upcoming visits, recent activity and quick actions
- View, search and filter their own appointments; cancel with confirmation
- View and edit their profile (contact details, blood group)
- Read general health tips and contact support
- View sample medical records and lab reports (clearly labelled as sample data)

### Doctor
- Sign up by choosing a speciality and setting a name, password, years of experience, and consultation fee
- Sign in to a personal dashboard
- Toggle availability / mark themselves on leave
- See their booked appointments (soonest first) and manage their weekly slots
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
- **React Context API** for theme, auth, doctor, patient and toast-message state
- **Redux Toolkit** (`@reduxjs/toolkit` + `react-redux`) for the shared appointment list
- Custom hooks: `useLocalStorage`, `useForm` and `useFetch`
- **Plain CSS** (no SCSS or Sass): colours, radii, shadows and timings are CSS variables in `tokens.css`, there is one CSS file per area of the site, and animations respect `prefers-reduced-motion`

## State Management: What Lives Where

| State | Where | Why |
|---|---|---|
| Theme, signed-in user, doctor and patient lists, toast messages | **Context API** (`src/context`) | Session and UI information that rarely changes and is read by many components. |
| Appointment list (book, cancel, remove) | **Redux Toolkit** (`src/store`) | Written by the booking page, read by five other pages (patient, doctor and admin views). One store keeps them in step. |
| Form values, search text, tab filter, open dialog, FAQ panel, demo switch | **Local state** (`useState` inside the component) | Only one component needs it, so it is not shared. |
| Data fetched for the health tips | **Local async state** (`useFetch` hook) | One page needs it; the hook tracks `loading` / `success` / `error`. |

Redux pieces: `store/store.js` (the store and `localStorage` saving), `store/appointmentsSlice.js` (state,
reducers, generated actions and selectors) and `<Provider store={store}>` in `main.jsx`. Pages use `useSelector`
to read and `useDispatch` to send actions such as `addAppointment`, `cancelAppointment` and `removeAppointment`.

## Project Structure

```
src/
  components/   Reusable UI (Navbar, Footer, AppLayout, RequireRole, PageHeader, StatCard,
                StatusBadge, EmptyState, LoadingState, ErrorState, ConfirmDialog, ...)
    form/       TextField, SelectField, TextAreaField
  context/      ThemeContext, AuthContext, DoctorsContext, PatientsContext, ToastContext
  store/        store.js, appointmentsSlice.js   (Redux Toolkit)
  data/         Seed data for doctors and sample medical records
  hooks/        useLocalStorage, useForm, useFetch
  pages/        Route-level views (Home, Dashboard, Appointments, HealthInfo, Contact, ...)
  styles/       Plain CSS: tokens.css (variables), base.css, motion.css plus one file per area, joined by @import in main.css
  utils/        slots.js, appointments.js, validators.js
public/
  data/health-tips.json   Sample content fetched by the Health Info page
```

## Routes

`/` · `/doctors` · `/doctors/:id` · `/book-appointment` · `/appointments` (patient) · `/dashboard` (patient) ·
`/records` · `/health-info` · `/contact` · `/profile` · `/login` · `/login/patient` · `/login/doctor` ·
`/login/admin` · `/doctor` · `/admin` · any other path shows the 404 page.

## Known Limitations

- All data lives in the browser's `localStorage`; clearing site data or switching devices resets it
- Passwords are stored as plain text locally — this is not a production-safe auth model
- Medical records shown to patients are static sample data, not yet linked to real appointments or prescriptions
- The health tips are sample content served from `public/data/health-tips.json` through a real `fetch` call. It stands in for a backend; the loading spinner is held for about 0.7 s so it is visible in demos. The *Demo: simulate a failed request* switch deliberately requests a missing file to show the error and retry flow
- Support messages are only saved in this browser; nothing is sent to a server
- `localStorage` is shared by everyone who uses the same browser profile and is not private or secure storage

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
