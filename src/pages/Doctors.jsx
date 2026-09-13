import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDoctors } from "../context/DoctorsContext";
import DoctorCard from "../components/DoctorCard";

function Doctors() {
  const { doctors } = useDoctors();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  // If we arrived here with ?specialty=... (e.g. from the home page cards),
  // pre-select that speciality in the filter.
  useEffect(() => {
    const fromUrl = searchParams.get("specialty");
    if (fromUrl && specialties.includes(fromUrl)) {
      setSpecialty(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSpecialtyChange = (value) => {
    setSpecialty(value);
    if (value === "All") {
      searchParams.delete("specialty");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ specialty: value });
    }
  };

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term);

      const matchesSpecialty =
        specialty === "All" || doctor.specialty === specialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, search, specialty]);

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">OUR SPECIALISTS</span>
            <h1>Find your doctor</h1>
            <p>Browse experienced professionals and book a convenient appointment.</p>
          </div>
          <span className="result-count">{filteredDoctors.length} doctors</span>
        </div>

        <div className="filter-bar">
          <label className="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search by doctor or speciality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search doctors"
            />
          </label>

          <select value={specialty} onChange={(e) => handleSpecialtyChange(e.target.value)} aria-label="Filter by speciality">
            <option>All</option>
            {specialties.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="doctor-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
          ) : (
            <div className="empty-state wide">
              <span>⌕</span>
              <h3>No doctors found</h3>
              <p>Try a different name or speciality.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Doctors;