import { Link, useParams } from "react-router-dom";
import { useDoctors, isDoctorBookable } from "../context/DoctorsContext";

function DoctorDetails() {
  const { id } = useParams();
  const { getDoctor } = useDoctors();
  const doctor = getDoctor(id);

  if (!doctor) {
    return (
      <main className="page">
        <div className="container empty-state">
          <span>?</span>
          <h1>Doctor not found</h1>
          <Link to="/doctors" className="primary-btn">Back to Doctors</Link>
        </div>
      </main>
    );
  }

  const bookable = isDoctorBookable(doctor);

  return (
    <main className="page">
      <div className="container">
        <Link to="/doctors" className="back-link">← Back to Doctors</Link>

        <section className="doctor-profile">
          <div className="profile-visual">
            <div className="large-avatar">DR</div>
            <span className={bookable ? "status available" : "status unavailable"}>
              {bookable ? "Available today" : "Currently unavailable"}
            </span>
          </div>

          <div className="profile-content">
            <span className="eyebrow">{doctor.specialty}</span>
            <h1>{doctor.name}</h1>
            {doctor.onLeave && (
              <span className="leave-badge leave-badge-lg">On leave — not accepting appointments</span>
            )}
            <div className="rating-line">★ {doctor.rating} <span>•</span> {doctor.experience} years experience</div>
            <p>{doctor.about}</p>

            <div className="profile-stats">
              <div><strong>₹{doctor.fee}</strong><span>Consultation</span></div>
              <div><strong>4.8/5</strong><span>Patient rating</span></div>
              <div><strong>{doctor.experience}+</strong><span>Years practice</span></div>
            </div>

            <h3>Available times</h3>
            <div className="timings">
              {doctor.timings.map((time) => <span key={time}>{time}</span>)}
            </div>

            {bookable ? (
              <Link to={`/book-appointment?doctor=${doctor.id}`} className="primary-btn">
                Book Appointment →
              </Link>
            ) : (
              <button className="disabled-btn" disabled>
                {doctor.onLeave ? "Currently on leave" : "Currently unavailable"}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DoctorDetails;
