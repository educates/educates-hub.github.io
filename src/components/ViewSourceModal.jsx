import { useEffect, useRef, useState } from "react";
import { IoOpen, IoCopy, IoDownload } from "react-icons/io5";

export default function ViewSourceModal({ show, onClose, downloadUrl, sourceContent }) {
  const modalRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState("copy");
  const [fileContent, setFileContent] = useState("");
  const [releaseContent, setReleaseContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [error, setError] = useState("");
  const [releaseError, setReleaseError] = useState("");

  useEffect(() => {
    if (window.bootstrap && modalRef.current) {
      const modal = new window.bootstrap.Modal(modalRef.current, {
        backdrop: 'static',
      });
      if (show) {
        modal.show();
      } else {
        modal.hide();
      }
      return () => {
        modal.hide();
      };
    }
  }, [show]);

  // If sourceContent is provided, use it as the file content
  const displayContent = sourceContent !== undefined ? sourceContent : fileContent;

  const logError = (error) => {
    console.error(error);
    setError(error.message || error.toString());
  };
  const logReleaseError = (error) => {
    console.error(error);
    setReleaseError(error.message || error.toString());
  };

  const handleCopy = () => {
    if (displayContent && navigator.clipboard) {
      navigator.clipboard.writeText(displayContent);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(src);
    }
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("copy"), 1500);
  };

  // We link to the download url from GitHub
  const handleDownload = () => {
    console.log("downloadUrl: ", downloadUrl);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadUrl.split('/').pop() || 'workshop.yaml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (displayContent) {
      const blob = new Blob([displayContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      window.open(src, '_blank');
    }
  };

  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="viewSourceModalLabel"
      inert={!show}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxWidth: '90vw' }}>
        <div className="modal-content border-primary border-2">
          <div className="modal-header align-items-start">
            <h5 className="modal-title text-primary" id="viewSourceModalLabel">
              Workshop Source
            </h5>
            <div className="ms-auto d-flex gap-2">
              <button
                className="btn btn-secondary btn-sm"
                title="Open in new tab"
                onClick={handleOpenInNewTab}
                type="button"
              >
                <IoOpen size={18} />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                title="Copy Source"
                onClick={handleCopy}
                type="button"
              >
                {copyStatus === "copied" ? (
                  <span>Copied!</span>
                ) : (
                  <IoCopy size={18} />
                )}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                title="Download Source"
                onClick={handleDownload}
                type="button"
              >
                <IoDownload size={18} />
              </button>
              <button
                type="button"
                className="btn-close ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
          </div>
          <div className="modal-body p-0" style={{ maxHeight: '70vh', overflow: 'auto' }}>
            {/* If sourceContent is provided, show it directly, else fallback to old logic */}
            {sourceContent !== undefined ? (
              <pre className="m-0 p-4 bg-light text-secondary" style={{ minHeight: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{sourceContent}</pre>
            ) : loading ? (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
                Loading...
              </div>
            ) : error ? (
              <div className="alert alert-danger m-4">{error}</div>
            ) : (
              <pre className="m-0 p-4 bg-light text-secondary" style={{ minHeight: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{fileContent}</pre>
            )}
            {releaseLoading && (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
                Loading release asset...
              </div>
            )}
            {releaseError && (
              <div className="alert alert-danger m-4">{releaseError}</div>
            )}
          </div>
          <div className="modal-footer" style={{ justifyContent: 'flex-start'}}>
            <b>NOTE:</b> Keep in mind that this is the source code for the workshop and not the distribution workshop file that is available at{' '}
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">{downloadUrl}</a>
          </div>
        </div>
      </div>
    </div>
  );
} 