import { useState, useEffect } from 'react';
import InstallIsland from './InstallIsland.jsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Clipboard, X } from 'react-bootstrap-icons';
import { fetchSourceFile, handleDownloadSourceFile, getRepoUrl } from '../utils/sources.ts';

export default function WorkshopDetail({ workshop }) {
  const [sourceContent, setSourceContent] = useState("");

  useEffect(() => {
    async function fetchSource() {
      const source = await fetchSourceFile("workshops", workshop.slug);
      setSourceContent(source);
    }
    fetchSource();
  }, [workshop]);

  const repoUrl = getRepoUrl(workshop.repository);

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-lg border-primary border-opacity-10 fade-in p-4 position-relative" >
            <button
              className="btn btn-sm btn-light position-absolute"
              style={{ top: 12, right: 12, zIndex: 10 }}
              title="Close"
              onClick={() => window.history.back()}
            >
              <X size={20} />
            </button>
            <div className="row g-3">
              {/* Left: Image, Title, Labels, Main Info */}
              <div className="col-md-8">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="img-fluid bg-light rounded me-3"
                    style={{ maxHeight: 100, maxWidth: 120, objectFit: 'contain', border: '1px solid #bcd' }}
                  />
                  <div className="flex-grow-1">
                    <h2 className="h4 text-primary fw-bold mb-1">{workshop.title}</h2>
                    <div>
                      {workshop.labels && workshop.labels.map((label) => (
                        <span key={label} className="badge bg-primary bg-opacity-10 text-primary fw-normal me-1 mb-1">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded p-3 mb-3">
                  <div className="fw-bold mb-1">WORKSHOP DESCRIPTION:</div>
                  <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{workshop.description}</div>
                </div>
                {workshop.prerequisites && workshop.prerequisites.trim() !== '' && (
                  <div className="bg-white rounded p-3 mb-3">
                    <div className="fw-bold mb-1">WORKSHOP PREREQUISITES:</div>
                    <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{workshop.prerequisites}</div>
                  </div>
                )}
                {workshop.release_notes && workshop.release_notes.trim() !== '' && (
                  <div className="bg-white rounded p-3 mb-3">
                    <div className="fw-bold mb-1">RELEASE NOTES:</div>
                    <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{workshop.release_notes}</div>
                  </div>
                )}
                <div className="bg-white rounded p-3 mb-3 position-relative" style={{ minHeight: 200 }}>
                  <div className="fw-bold mb-1">SOURCE FILE</div>
                  {/* Copy button overlay */}
                  <button
                    className="btn btn-sm btn-outline-primary position-absolute"
                    style={{ top: 12, right: 12, zIndex: 2 }}
                    type="button"
                    title="Copy Source"
                    onClick={() => { navigator.clipboard.writeText(sourceContent) }}
                  >
                    <Clipboard size={18} />
                  </button>
                  <div className="text-secondary">
                    <SyntaxHighlighter
                      language="yaml"
                      customStyle={{ fontSize: '0.95em', margin: 0, padding: 0 }}
                      wrapLongLines={true}
                      showLineNumbers={true}
                    >
                      {sourceContent}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
              {/* Right: Actions and Repo Info */}
              <div className="col-md-4">
                <div className="d-grid gap-2 mt-5">
                  <InstallIsland client:load downloadUrl={workshop.install_url} />
                  <button
                    className="btn btn-outline-primary btn-sm"
                    title="Download Source"
                    onClick={() => handleDownloadSourceFile('workshops', workshop.slug)}
                    type="button"
                  >
                    Download
                  </button>
                </div>
                {workshop.repository && (workshop.repository.org || workshop.repository.name || workshop.repository.ref || workshop.repository.path) && (
                  <div className="rounded p-3 mb-3">
                    <div className="fw-bold mb-1">REPOSITORY:</div>
                    <ul className="mb-2 ps-3">
                      {workshop.repository.org && <li><b>org:</b> {workshop.repository.org}</li>}
                      {workshop.repository.name && <li><b>name:</b> {workshop.repository.name}</li>}
                      {workshop.repository.ref && <li><b>ref:</b> {workshop.repository.ref}</li>}
                      {workshop.repository.path && <li><b>path:</b> {workshop.repository.path}</li>}
                    </ul>
                    {repoUrl && (
                      <a className="btn btn-outline-primary btn-sm w-100" href={repoUrl} target="_blank" rel="noopener noreferrer">
                        Go to Repo
                      </a>
                    )}
                  </div>
                )}
                {(workshop.author || workshop.date_created) && (
                  <div className="bg-white rounded p-3 mb-3">
                    {workshop.author && <div><b>Author:</b> {workshop.author}</div>}
                    {workshop.date_created && <div><b>Date:</b> {new Date(workshop.date_created).toLocaleDateString()}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 