import { useState, useMemo } from "react";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

export default function WorkshopGrid({ workshops }) {
  const [search, setSearch] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Get all unique labels
  const allLabels = useMemo(
    () => Array.from(new Set(workshops.flatMap((w) => w.labels || []))).sort(),
    [workshops],
  );

  // Filtering logic
  const filtered = useMemo(() => {
    return workshops.filter((w) => {
      const matchesSearch =
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase());
      const matchesLabels =
        selectedLabels.length === 0 ||
        selectedLabels.every((l) => (w.labels || []).includes(l));
      return matchesSearch && matchesLabels;
    });
  }, [workshops, search, selectedLabels]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Handlers
  const toggleLabel = (label) => {
    setPage(1);
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleSearch = (e) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const clearAll = () => {
    setSelectedLabels([]);
    setSearch("");
    setPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="row">
      {/* Sidebar */}
      <aside className="col-12 col-md-3 mb-4 mb-md-0">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h6 fw-bold text-primary mb-3">Filter by Label</h2>
            <button
              className="btn btn-outline-secondary btn-sm mb-3 w-100"
              onClick={clearAll}
            >
              Clear All
            </button>
            <div className="d-flex flex-column gap-2">
              {allLabels.map((label) => (
                <div className="form-check" key={label}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={label}
                    id={`label-${label}`}
                    checked={selectedLabels.includes(label)}
                    onChange={() => toggleLabel(label)}
                  />
                  <label
                    className="form-check-label text-secondary"
                    htmlFor={`label-${label}`}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
      {/* Main content */}
      <section className="col-12 col-md-9">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="Search workshops..."
            className="form-control form-control-lg w-75"
            value={search}
            onChange={handleSearch}
          />
          <div className="ms-3">
            <label htmlFor="pageSizeSelect" className="form-label me-2 mb-0">
              Workshops per page:
            </label>
            <select
              id="pageSizeSelect"
              className="form-select d-inline-block w-auto"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row g-4">
          {paginated.map((workshop) => (
            <div className="col-12 col-md-4 d-flex" key={workshop.slug}>
              <a
                href={`/${workshop.slug}`}
                className="text-decoration-none fade-in w-100"
              >
                <div
                  className="card h-100 shadow-sm border-primary border-opacity-10 transition-transform"
                  style={{ transition: "box-shadow 0.2s, transform 0.2s" }}
                >
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="card-img-top bg-light p-3"
                    style={{ height: 140, objectFit: "contain" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h2 className="card-title h6 text-primary fw-bold mb-2">
                      {workshop.title}
                    </h2>
                    <p className="card-text text-secondary small mb-2">
                      {workshop.description}
                    </p>
                    <div className="mb-2">
                      {(workshop.labels || []).map((label) => (
                        <span
                          className="badge bg-primary bg-opacity-10 text-primary fw-normal me-1 mb-1"
                          key={label}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="text-muted small mt-auto">
                      By {workshop.author}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  className={`page-item${page === i + 1 ? " active" : ""}`}
                  key={i}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item${page === totalPages ? " disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </section>
    </div>
  );
}
