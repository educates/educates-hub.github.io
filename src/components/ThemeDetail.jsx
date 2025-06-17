import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Clipboard, X } from 'react-bootstrap-icons';
import { fetchSourceFile, handleDownloadSourceFile } from '../utils/sources.ts';

export default function ThemeDetail({ theme }) {
  const [sourceContent, setSourceContent] = useState("");

  useEffect(() => {
    async function fetchSource() {
      const source = await fetchSourceFile("themes", theme.slug);
      setSourceContent(source);
    }
    fetchSource();
  }, [theme]);

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
                    src={theme.image}
                    alt={theme.title}
                    className="img-fluid bg-light rounded me-3"
                    style={{ maxHeight: 100, maxWidth: 120, objectFit: 'contain', border: '1px solid #bcd' }}
                  />
                  <div className="flex-grow-1">
                    <h2 className="h4 text-primary fw-bold mb-1">{theme.title}</h2>
                    <div>
                      {theme.labels && theme.labels.map((label) => (
                        <span key={label} className="badge bg-primary bg-opacity-10 text-primary fw-normal me-1 mb-1">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded p-3 mb-3">
                  <div className="fw-bold mb-1">DESCRIPTION:</div>
                  <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{theme.description}</div>
                </div>
                {theme.release_notes && theme.release_notes.trim() !== '' && (
                  <div className="bg-white rounded p-3 mb-3">
                    <div className="fw-bold mb-1">RELEASE NOTES:</div>
                    <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{theme.release_notes}</div>
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
                  <button
                    className="btn btn-outline-primary btn-sm"
                    title="Download Source"
                    onClick={() => handleDownloadSourceFile('themes', theme.slug)}
                    type="button"
                  >
                    Download
                  </button>
                </div>
                {theme.repo_url && (
                  <div className="rounded p-3 mb-3">
                    <div className="fw-bold mb-1">REPOSITORY:</div>
                    <a className="btn btn-outline-primary btn-sm w-100" href={theme.repo_url} target="_blank" rel="noopener noreferrer">
                      Go to Repo
                    </a>
                  </div>
                )}
                {(theme.author || theme.date_created || theme.version) && (
                  <div className="bg-white rounded p-3 mb-3">
                    {theme.author && <div><b>Author:</b> {theme.author}</div>}
                    {theme.date_created && <div><b>Date:</b> {new Date(theme.date_created).toLocaleDateString()}</div>}
                    {theme.version && <div><b>Version:</b> {theme.version}</div>}
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