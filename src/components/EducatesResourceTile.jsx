import React from "react";

export default function EducatesResourceTile({ educatesResource, class: className = "" }) {
  return (
    <a href={`/${educatesResource.slug}`} className={`text-decoration-none ${className}`}>
      <div
        className="card h-100 shadow-sm border-primary border-opacity-10 transition-transform"
        style={{ transition: "box-shadow 0.2s, transform 0.2s" }}
      >
        <img
          src={educatesResource.image}
          alt={educatesResource.title}
          className="card-img-top bg-light p-3"
          style={{ height: 140, objectFit: "contain" }}
        />
        <div className="card-body d-flex flex-column">
          <h2 className="card-title h6 text-primary fw-bold mb-2">{educatesResource.title}</h2>
          <p className="card-text text-secondary small mb-2">{educatesResource.description}</p>
          <div className="mb-2">
            {(educatesResource.labels || []).map((label) => (
              <span className="badge bg-primary bg-opacity-10 text-primary fw-normal me-1 mb-1" key={label}>
                {label}
              </span>
            ))}
          </div>
          <div className="text-muted small mt-auto">By {educatesResource.author}</div>
        </div>
      </div>
    </a>
  );
} 