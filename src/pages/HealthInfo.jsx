import { useMemo, useState } from "react";
import useFetch from "../hooks/useFetch";
import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

// The tips are loaded with fetch() from a JSON file in /public. It stands in for
// a real health-content API; swapping it later only means changing this URL.
const TIPS_URL = "/data/health-tips.json";
// A file that does not exist, used by the demo switch to produce a real failed request.
const BROKEN_URL = "/data/health-tips-missing.json";

function HealthInfo() {
  // LOCAL state: the filters and the demo switch only matter on this page.
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Async state: status is "loading", "success" or "error".
  const { status, data, error, retry } = useFetch(simulateFailure ? BROKEN_URL : TIPS_URL, { minDelay: 700 });

  const tips = Array.isArray(data) ? data : [];
  const categories = useMemo(() => ["All", ...new Set(tips.map((tip) => tip.category))], [tips]);

  const filtered = tips.filter((tip) => {
    const term = search.trim().toLowerCase();
    const matchesText = !term || tip.title.toLowerCase().includes(term) || tip.summary.toLowerCase().includes(term);
    return matchesText && (category === "All" || tip.category === category);
  });

  return (
    <main className="page">
      <div className="container">
        <PageHeader
          eyebrow="HEALTH INFORMATION"
          title="Everyday health tips"
          description="Short, general guidance for staying well."
        >
          {status === "success" && <span className="result-count">{filtered.length} tips</span>}
        </PageHeader>

        <div className="notice" role="note">
          <strong>Sample content.</strong> These tips are general information loaded from a demo file. They are not
          medical advice. Please talk to a doctor about your own health.
        </div>

        <label className="demo-switch">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
          />
          <span>Demo: simulate a failed request</span>
        </label>

        {status === "loading" && <LoadingState label="Loading health tips..." />}

        {status === "error" && (
          <ErrorState
            title="We couldn't load the health tips"
            message={`${error} Check your connection and try again.`}
            onRetry={() => {
              // Retrying while the demo switch is on would fail again, so switch it off first.
              if (simulateFailure) setSimulateFailure(false);
              else retry();
            }}
          />
        )}

        {status === "success" && (
          <>
            <div className="filter-bar">
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Search tips..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search health tips"
                />
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by topic">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            {filtered.length > 0 ? (
              <div className="tip-grid">
                {filtered.map((tip) => (
                  <article className="tip-card" key={tip.id}>
                    <span className="tip-category">{tip.category}</span>
                    <h3>{tip.title}</h3>
                    <p>{tip.summary}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState icon="⌕" title="No tips found" text="Try a different word or topic." />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default HealthInfo;
