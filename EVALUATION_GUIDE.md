# AetherCare — Practical Evaluation and Viva Guide

Everything below refers to code that exists in this project. File names are relative to `src/`.

## 1. Syllabus mapping

| Syllabus topic | Where it is demonstrated |
|---|---|
| HTML, CSS, JavaScript | `index.html`; plain CSS files in `styles/` (variables in `tokens.css`, joined by `@import` in `main.css`); array methods (`map`, `filter`, `sort`, `slice`, `find`, `some`) in `pages/Dashboard.jsx`, `pages/Appointments.jsx` |
| DOM manipulation | `context/ThemeContext.jsx` sets `document.documentElement.dataset.theme`; `pages/MedicalRecords.jsx` sets `document.title`; `hooks/useForm.js` moves focus to the first invalid field |
| Components, props, state, events | `components/StatCard.jsx`, `StatusBadge.jsx`, `AppointmentCard.jsx`, `ConfirmDialog.jsx` (props); `onChange`, `onSubmit`, `onClick` handlers in every page |
| React Router basics | `App.jsx` (`BrowserRouter`, `Routes`, `Route`), `Link`/`NavLink` in `components/Navbar.jsx`, `useParams` in `pages/DoctorDetails.jsx`, `useSearchParams` in `pages/BookAppointment.jsx` |
| Navigation layout and page structure | `components/AppLayout.jsx` (Navbar + `<Outlet />` + Footer), shared by every route |
| Multi-page SPA | 16 routes, no full page reloads; `pages/NotFound.jsx` handles unknown URLs |
| Context API | `context/` — Theme, Auth, Doctors, Patients, Toast |
| Global vs local state | See section 3 |
| Redux Toolkit | `store/store.js`, `store/appointmentsSlice.js`, `<Provider>` in `main.jsx` |
| Async state with loading and error handling | `hooks/useFetch.js` used by `pages/HealthInfo.jsx` |
| Form handling and validation | `hooks/useForm.js`, `utils/validators.js`; used by booking, profile, patient sign-in and contact forms |
| Reusable input components | `components/form/TextField.jsx`, `SelectField.jsx`, `TextAreaField.jsx` |

## 2. Beginner-friendly tour of the important pieces

- **`AppLayout`** draws the Navbar and Footer once. React Router's `<Outlet />` is the "hole" where the current page appears.
- **`RequireRole`** is a route guard: it shows the page only if the signed-in user has the right role, otherwise it shows a friendly sign-in prompt.
- **`appointmentsSlice.js`** holds the appointment list. `createSlice` generates the actions `addAppointment`, `cancelAppointment` and `removeAppointment`. Selectors such as `selectAppointmentsByPatient` read from it.
- **`store.js`** creates the store and saves `appointments.items` to `localStorage` whenever they change.
- **`useForm`** keeps `values`, `touched` and `submitted`. Errors come from a `validate` function you pass in, and `getError(name)` only shows an error after the field was touched or the form was submitted.
- **`validators.js`** has tiny rule functions (`required`, `minLength`, `email`, `phone`...). Each returns an error message or `""`.
- **`useFetch`** keeps `status` (`loading`, `success`, `error`), `data`, `error` and a `retry()` function. It uses `fetch`, `async/await` and an `AbortController` so a request is cancelled if you leave the page.
- **`ConfirmDialog`** asks "are you sure?" before cancelling or removing an appointment.

## 3. Context API vs Redux Toolkit vs local state (as implemented)

| Kind | What it holds | Why this choice |
|---|---|---|
| **Context API** | Theme, signed-in user, doctor list, patient list, toast messages | Session and UI information. Changes rarely, many components read it. |
| **Redux Toolkit** | The appointment list | Written by the booking page, read by the Dashboard, Appointments, Doctor and Admin pages. Needs predictable updates through actions. |
| **Local state (`useState`)** | Form values, search text, tab filter, open dialog, FAQ panel, demo switch | Only one component needs it, so it is not shared. |

Appointments live **only** in Redux; they are not duplicated in a Context.

## 4. Suggested demonstration sequence (about 8 minutes)

1. **Home page** — show the navbar, then toggle light/dark theme (Context + DOM `dataset`).
2. **Doctors** — search and filter, open one doctor (`useParams`).
3. **Book without signing in** — shows the route guard message.
4. **Patient sign up** (Login → Patient → Sign up, password of 4+ characters).
5. **Book an appointment** — press *Confirm* with the form empty to show inline errors; type 3 letters in "Reason" to show the length rule; then fill it correctly and confirm.
6. **Dashboard** — the new booking appears in the stat cards, "next appointment" and recent activity.
7. **Appointments** — use tabs and search, cancel one (confirmation dialog), show it moves to *Cancelled*, then remove it.
8. **Health Info** — loading spinner, tips appear. Tick **Demo: simulate a failed request** to see the error message, then press **Try again**.
9. **Contact** — submit with errors, then a valid message; open the FAQ.
10. **Type a wrong URL** — the 404 page.
11. **Refresh the browser** — bookings stay (they are saved in `localStorage`).
12. **Sign in as a doctor** (e.g. *Arjun Kapoor*, password `AetherCare`) — "Your booked appointments" shows the patient's booking, read from the same Redux store.

## 5. Viva questions and answers

**1. Why did you use both Context API and Redux Toolkit?**
Context holds small, rarely changing app-wide information (theme, user, toasts, doctor and patient lists). Redux Toolkit holds the appointment list, which many pages read and several actions change. Using both shows the difference; no data is stored in both.

**2. What is a slice?**
`createSlice` in `appointmentsSlice.js` bundles the initial state, the reducers and the action creators for one feature. The generated actions are `addAppointment`, `cancelAppointment` and `removeAppointment`.

**3. Redux says never mutate state, but your reducer does `state.items.push(...)`. Why is that allowed?**
Redux Toolkit uses Immer. Inside `createSlice` reducers, code that looks like mutation is converted into an immutable update behind the scenes.

**4. What does `prepare` do in `addAppointment`?**
It builds the full appointment object (adds `id`, `status: "Confirmed"` and `createdAt`) so the component only sends the form values.

**5. What is a selector and why use one?**
A function that reads from the state, such as `selectAppointmentsByPatient`. Components do not need to know the state shape, and `createSelector` remembers its last result so lists are not rebuilt needlessly.

**6. How does a component read and change Redux state?**
`useSelector` reads, `useDispatch` returns `dispatch`. For example `dispatch(cancelAppointment(id))` in `Appointments.jsx`. `<Provider store={store}>` in `main.jsx` makes the store available.

**7. Why does cancelling not delete the appointment?**
`cancelAppointment` sets `status` to `"Cancelled"`, so the patient keeps a history and the time slot becomes free again. `removeAppointment` deletes it permanently from the cancelled list.

**8. How is "Past" decided?**
`displayStatus` in `utils/appointments.js` compares the appointment's date and time with the current time. The stored status is only Confirmed or Cancelled.

**9. What is a controlled input?**
An input whose `value` comes from state and whose `onChange` updates that state. `useForm` keeps all values in one `values` object and `handleChange` updates the field named by `event.target.name`.

**10. Why do errors not appear while the person is still typing the first letter?**
`getError` in `useForm` returns an error only when the field is *touched* (left via `onBlur`) or the form was *submitted*.

**11. How does double-booking get prevented?**
`BookAppointment.jsx` checks `isSlotTaken` against the active (non-cancelled) appointments from Redux. Taken times are disabled in the dropdown, and `validate` rejects them again on submit.

**12. How does the loading / error / retry flow work?**
`useFetch` starts with `status: "loading"`, then sets `"success"` with the data or `"error"` with a message inside `try/catch`. The page shows `LoadingState`, the tips, or `ErrorState`. The retry button increases an `attempt` counter, which is in the effect's dependency list, so the request runs again.

**13. Why `AbortController` in `useFetch`?**
The effect's cleanup function aborts the request if the component unmounts or the URL changes, so a late response does not update a screen that is gone.

**14. Is the health data real?**
No. It is sample content in `public/data/health-tips.json`, fetched with a real `fetch` call to stand in for an API. It is labelled "Sample content" on the page and is not medical advice.

**15. What does `<Outlet />` do?**
In `AppLayout.jsx` it renders whichever child route matched, so the Navbar and Footer stay the same across pages.

**16. How is the active nav link highlighted?**
`NavLink` in `Navbar.jsx` adds an `active` class to the link whose path matches the current URL.

**17. What are the limitations?**
Everything is saved in the browser's `localStorage` (cleared with site data, not shared between devices, not secure), passwords are stored in plain text for demo purposes, and there is no backend or real healthcare system.

**18. How does dark mode work with only CSS?**
`styles/tokens.css` defines every colour as a CSS variable (for example `--ink`, `--surface`). The light colours are on `:root`; the dark colours are on `:root[data-theme="dark"]` and replace the same names. `ThemeContext.jsx` sets `data-theme` on the `<html>` element, so every rule that uses `var(--ink)` switches colour at once.

**19. How are the CSS files joined together?**
`main.jsx` imports one file, `styles/main.css`, which uses `@import` to load `tokens.css` first and then one file for each area (`base.css`, `navbar.css`, `doctors.css`...). Later files win when two rules are equally specific, so the order in `main.css` matters.

## 6. Testing notes

To test the failure path: open **Health Info**, tick *Demo: simulate a failed request*; the app requests a file that does not exist. To test persistence: book an appointment and refresh. To reset all demo data: clear the site's `localStorage` in the browser developer tools.
