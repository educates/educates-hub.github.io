import React, { useState, useEffect } from "react";
import EducatesResourceGrid from "./EducatesResourceGrid.jsx";

function getTypeFromUrl(defaultType, allResources) {
  if (typeof window === 'undefined') return defaultType;
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  if (type && Object.keys(allResources).includes(type)) {
    return type;
  }
  return defaultType;
}

export default function EducatesResourceSelectorIsland({ allResources }) {
  const defaultType = "Workshop";
  const [type, setType] = useState(() => getTypeFromUrl(defaultType, allResources));
  const [items, setItems] = useState(allResources[type] || []);

  useEffect(() => {
    setItems(allResources[type] || []);
    // Update the URL query parameter when type changes
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('type', type);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
  }, [type, allResources]);

  useEffect(() => {
    // Listen for popstate (back/forward navigation)
    const onPopState = () => {
      setType(getTypeFromUrl(defaultType, allResources));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [allResources]);

  return (
    <>
      <div className="mb-4 d-flex gap-4 align-items-center">
        <span className="fw-bold">Educates Resource Type:</span>
        {Object.keys(allResources).map((key) => (
          <div className="form-check form-check-inline" key={key}>
            <input
              className="form-check-input"
              type="radio"
              name="typeRadio"
              id={`radio-${key}`}
              value={key}
              checked={type === key}
              onChange={() => setType(key)}
            />
            <label className="form-check-label" htmlFor={`radio-${key}`}>
              {key.replace(/([A-Z])/g, " $1").trim()}
            </label>
          </div>
        ))}
      </div>
      <EducatesResourceGrid resources={items} />
    </>
  );
} 