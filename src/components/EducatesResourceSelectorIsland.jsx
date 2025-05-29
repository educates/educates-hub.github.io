import React, { useState, useEffect } from "react";
import EducatesResourceGrid from "./EducatesResourceGrid.jsx";
import { loadWorkshops, loadExtensionPackages, loadEditorExtensions, loadKyvernoPolicies } from "../utils/loadWorkshops.js";

export default function EducatesResourceSelectorIsland() {
  const [type, setType] = useState("Workshop");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      if (type === "Workshop") {
        setItems(await loadWorkshops());
      } else if (type === "ExtensionPackage") {
        setItems(await loadExtensionPackages());
      } else if (type === "EditorExtension") {
        setItems(await loadEditorExtensions());
      } else if (type === "KyvernoPolicy") {
        setItems(await loadKyvernoPolicies());
      }
      else {
        setItems([]);
      }
      setLoading(false);
    };
    load();
  }, [type]);

  return (
    <>
      <div className="mb-4 d-flex gap-4 align-items-center">
        <span className="fw-bold">Educates Resource Type:</span>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="typeRadio"
            id="radio-workshops"
            value="Workshop"
            checked={type === "Workshop"}
            onChange={() => setType("Workshop")}
          />
          <label className="form-check-label" htmlFor="radio-workshops">
            Workshops
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="typeRadio"
            id="radio-extension-packages"
            value="ExtensionPackage"
            checked={type === "ExtensionPackage"}
            onChange={() => setType("ExtensionPackage")}
          />
          <label className="form-check-label" htmlFor="radio-extension-packages">
            Extension Packages
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="typeRadio"
            id="radio-editor-extensions"
            value="EditorExtension"
            checked={type === "EditorExtension"}
            onChange={() => setType("EditorExtension")}
          />
          <label className="form-check-label" htmlFor="radio-editor-extensions">
            Editor Extensions
          </label>
        </div>
          <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="typeRadio"
            id="radio-kyverno-policies"
            value="KyvernoPolicy"
            checked={type === "KyvernoPolicy"}
            onChange={() => setType("KyvernoPolicy")}
          />
          <label className="form-check-label" htmlFor="radio-kyverno-policies">
            Kyverno Policies
          </label>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <EducatesResourceGrid resources={items} />
      )}
    </>
  );
} 