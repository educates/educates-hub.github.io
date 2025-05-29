import { useRef, useState, useEffect } from 'react';

export default function InstallModal({ show, onClose, installUrl, workshopSlug, downloadUrl }) {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const installCmdRef = useRef(null);
  const modalRef = useRef(null);

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

  const handleCopy = () => {
    if (installCmdRef.current) {
      const text = installCmdRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 1500);
      });
    }
  };

  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="installModalLabel"
      inert={!show}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-primary border-2">
          <div className="modal-header">
            <h5 className="modal-title text-primary" id="installModalLabel">
              Install Instructions
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Install Command</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={handleCopy}
              >
                {copyStatus}
              </button>
            </div>
            <pre
              ref={installCmdRef}
              className="bg-light p-3 rounded small text-secondary mb-3"
              style={{ userSelect: 'all' }}
            >
{`educates deploy-workshop -f ${downloadUrl}`}
            </pre>
            {/* <div className="text-muted small">Replace <code>my-{workshopSlug}</code> with your desired release name.</div> */}
          </div>
        </div>
      </div>
    </div>
  );
} 