import { useEffect, useState } from "react";
import records from "../data/records";

function MedicalRecords() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.title = selected ? `AetherCare | ${selected.title}` : "AetherCare | Medical Records";
    return () => { document.title = "AetherCare | Smart Healthcare"; };
  }, [selected]);

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">HEALTH HISTORY</span>
            <h1>Medical records</h1>
            <p>View your saved consultation and lab-report information.</p>
          </div>
        </div>

        <div className="records-grid">
          {records.map((record) => (
            <article className="record-card" key={record.id}>
              <div className="record-icon">{record.type === "Lab Report" ? "⌁" : "✚"}</div>
              <span className="record-type">{record.type}</span>
              <h3>{record.title}</h3>
              <p>{record.doctor}</p>
              <div className="record-bottom">
                <span>{record.date}</span>
                <button className="text-btn" onClick={() => setSelected(record)}>View details →</button>
              </div>
            </article>
          ))}
        </div>

        {selected && (
          <div className="modal-backdrop" onClick={() => setSelected(null)}>
            <section className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <button className="close-btn" onClick={() => setSelected(null)} aria-label="Close">×</button>
              <span className="eyebrow">{selected.type}</span>
              <h2>{selected.title}</h2>
              <p><strong>Doctor/Provider:</strong> {selected.doctor}</p>
              <p><strong>Date:</strong> {selected.date}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <div className="note-box">{selected.notes}</div>
              <p className="form-note">This record is provided for reference only.</p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default MedicalRecords;