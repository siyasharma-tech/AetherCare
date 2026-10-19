import { useState } from "react";
import { Link } from "react-router-dom";
import useForm from "../hooks/useForm";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "../context/ToastContext";
import { email, maxLength, minLength, required, validateAll } from "../utils/validators";
import PageHeader from "../components/PageHeader";
import TextField from "../components/form/TextField";
import SelectField from "../components/form/SelectField";
import TextAreaField from "../components/form/TextAreaField";

const TOPICS = [
  { value: "", label: "Choose a topic" },
  { value: "Appointments", label: "Appointments" },
  { value: "Account", label: "My account" },
  { value: "Doctors", label: "Doctors and availability" },
  { value: "Feedback", label: "Feedback" }
];

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Sign in as a patient, open a doctor's profile and choose Book Appointment. Pick a date and an open time, then add the reason for your visit."
  },
  {
    q: "Can I cancel an appointment?",
    a: "Yes. Open My appointments, press Cancel on an upcoming visit and confirm. The time slot becomes free for other patients."
  },
  {
    q: "Where is my information stored?",
    a: "AetherCare is a demonstration project. Everything is saved only in this browser, so clearing site data removes it."
  },
  {
    q: "Is this real medical advice?",
    a: "No. The health tips and records are sample content. Please speak to a qualified doctor about your health."
  }
];

const RULES = {
  name: [required("Name"), minLength(2, "Name")],
  email: [required("Email"), email],
  topic: [required("Topic")],
  message: [required("Message"), minLength(10, "Message"), maxLength(500, "Message")]
};

const EMPTY = { name: "", email: "", topic: "", message: "" };

function Contact() {
  const { showToast } = useToast();
  // Saved only in this browser; there is no server to send it to.
  const [requests, setRequests] = useLocalStorage("aethercareSupportRequests", []);
  const [openFaq, setOpenFaq] = useState(0); // LOCAL state: which FAQ is expanded
  const [sent, setSent] = useState(false);

  const form = useForm(EMPTY, (values) => validateAll(values, RULES));
  const { values } = form;

  const onValid = (v) => {
    const request = { id: Date.now(), ...v, name: v.name.trim(), message: v.message.trim(), sentAt: Date.now() };
    setRequests([request, ...requests].slice(0, 5));
    showToast("Your message was saved on this device.");
    setSent(true);
    form.reset(EMPTY);
  };

  return (
    <main className="page">
      <div className="container">
        <PageHeader
          eyebrow="SUPPORT"
          title="Contact and support"
          description="Ask a question or share feedback about AetherCare."
        />

        <div className="contact-layout">
          <form className="appointment-form" onSubmit={form.handleSubmit(onValid)} noValidate>
            <h2 className="form-title">Send a message</h2>

            {sent && (
              <div className="notice notice-success" role="status">
                <strong>Message saved.</strong> AetherCare has no server yet, so it is stored only in this
                browser. See it listed below.
              </div>
            )}

            <div className="form-row">
              <TextField
                label="Your name"
                name="name"
                required
                autoComplete="name"
                value={values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.getError("name")}
              />
              <TextField
                label="Email address"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.getError("email")}
              />
            </div>

            <SelectField
              label="Topic"
              name="topic"
              required
              value={values.topic}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.getError("topic")}
              options={TOPICS}
            />

            <TextAreaField
              label="Message"
              name="message"
              required
              rows={5}
              maxLength={500}
              value={values.message}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.getError("message")}
            />

            <button type="submit" className="primary-btn full">Send message</button>
          </form>

          <div className="contact-side">
            <section className="panel">
              <div className="panel-head"><h2>Common questions</h2></div>
              <div className="faq">
                {FAQS.map((item, index) => {
                  const open = openFaq === index;
                  return (
                    <div className={open ? "faq-item open" : "faq-item"} key={item.q}>
                      <h3>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={`faq-${index}`}
                          onClick={() => setOpenFaq(open ? -1 : index)}
                        >
                          {item.q}
                          <span aria-hidden="true">{open ? "−" : "+"}</span>
                        </button>
                      </h3>
                      {open && <p id={`faq-${index}`}>{item.a}</p>}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="panel">
              <div className="panel-head"><h2>Your saved messages</h2></div>
              {requests.length > 0 ? (
                <ul className="activity-list">
                  {requests.map((r) => (
                    <li key={r.id}>
                      <span>{r.topic}: {r.message.length > 60 ? `${r.message.slice(0, 60)}…` : r.message}</span>
                      <small>{new Date(r.sentAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="panel-hint">Messages you send will be listed here (last 5, this device only).</p>
              )}
              <Link to="/health-info" className="text-btn">Browse health tips →</Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
