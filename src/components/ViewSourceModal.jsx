import { useEffect, useRef, useState } from "react";
import { IoOpen, IoCopy, IoDownload } from "react-icons/io5";
import { Octokit } from "octokit";

export default function ViewSourceModal({ show, onClose, src, repo, assetId, downloadUrl }) {
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

  const logError = (error) => {
    console.error(error);
    setError(error.message || error.toString());
  };
  const logReleaseError = (error) => {
    console.error(error);
    setReleaseError(error.message || error.toString());
  };

  // Fetch file content from GitHub using Octokit when modal is shown
  useEffect(() => {
    if (show && repo && repo.org && repo.name && repo.path) {
      setLoading(true);
      logError("");
      setFileContent("");
      const octokit = new Octokit();
      octokit.rest.repos.getContent({
        owner: repo.org,
        repo: repo.name,
        path: repo.path,
        ref: repo.branch || 'main',
      })
        .then((res) => {
          // If file, decode base64
          if (res.data && res.data.type === 'file' && res.data.content) {
            const decoded = atob(res.data.content.replace(/\n/g, ''));
            setFileContent(decoded);
          } else {
            logError('File not found or not a regular file.');
          }
        })
        .catch((e) => {
          logError('Error loading file: ' + (e.message || e.toString()));
        })
        .finally(() => setLoading(false));
    } else {
      logError("No repo or path provided");
    }
  }, [show, repo]);

  // Fetch release asset content if asset_id is provided
  // TODO: We can not do this without a proxy because of CORS
  // useEffect(() => {
  //   if (show && repo && repo.org && repo.name && repo.asset_name) {
  //     setReleaseLoading(true);
  //     setReleaseError("");
  //     setReleaseContent("");
  //     const octokit = new Octokit();
  //     octokit.rest.repos.getReleaseAsset({
  //       owner: repo.org,
  //       repo: repo.name,
  //       asset_id: assetId,
  //       // Accept header for raw content
  //       headers: { Accept: 'application/octet-stream' },
  //     })
  //       .then((res) => {
  //         // The content is in res.data (as a Blob or ArrayBuffer)
  //         // Try to convert to string if possible
  //         let content = res.data;
  //         if (content instanceof ArrayBuffer) {
  //           content = new TextDecoder().decode(content);
  //         } else if (typeof content === 'object' && content instanceof Blob) {
  //           content.text().then(setReleaseContent);
  //           return;
  //         }
  //         setReleaseContent(content);
  //       })
  //       .catch((e) => {
  //         logReleaseError('Error loading release asset: ' + (e.message || e.toString()));
  //       })
  //       .finally(() => setReleaseLoading(false));
  //   } else {
  //     setReleaseContent("");
  //   }
  // }, [show, repo]);

  const handleCopy = () => {
    if (fileContent && navigator.clipboard) {
      navigator.clipboard.writeText(fileContent);
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
    if (fileContent) {
      const blob = new Blob([fileContent], { type: 'text/plain' });
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
            {loading ? (
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