import { Link } from "react-router-dom";
import { isDoctorBookable } from "../context/DoctorsContext";

function DoctorCard({ doctor }) {
  const bookable = isDoctorBookable(doctor);

  return (
    <article className="doctor-card">
      <div className="doctor-top">
        <div className="doctor-avatar">DR</div>
        <span className={bookable ? "status available" : "status unavailable"}>
          {bookable ? "Available" : "Unavailable"}
        </span>
      </div>

      <h3>{doctor.name}</h3>
      {doctor.onLeave && <span className="leave-badge">On leave</span>}
      <p className="specialty">{doctor.specialty}</p>

      <div className="doctor-meta">
        <span>★ {doctor.rating}</span>
        <span>{doctor.experience} yrs exp.</span>
      </div>

      <div className="doctor-footer">
        <strong>₹{doctor.fee}</strong>
        <Link to={`/doctors/${doctor.id}`} className="outline-btn">
          View Profile
        </Link>
      </div>
    </article>
  );
}

export default DoctorCard;
