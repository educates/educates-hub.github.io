import { useRef, useState, useEffect } from 'react';
import CopyableCodeBlock from './CopyableCodeBlock';

export default function InstallModal({ show, onClose, downloadUrl }) {
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

  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="installModalLabel"
      inert={!show}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
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
              If you want to install this workshop onto your own cluster, you can use the following command:
            </div>
            <CopyableCodeBlock
              title="Install Command"
              command={`educates deploy-workshop -f ${downloadUrl}`}
            />
            {/* <div className="text-muted small">Replace <code>my-{workshopSlug}</code> with your desired release name.</div> */}

            <div className="d-flex mt-3">
              <b>NOTE:</b>&nbsp;this command will deploy the workshop onto your cluster, but you will need to add it 
              to a TrainingPortal to make it available to your users.
            </div>
            <hr />
            <div className="d-flex flex-column mt-3 mb-2">
              <span className="modal-title text-primary">Test on a local cluster</span>
              <div className="mt-2">If you want to test the workshop on a local cluster:</div>
              <div className="mt-2">1. Create a local cluster.</div>
              <CopyableCodeBlock
                title="Create a local cluster Command"
                command={`educates create-cluster`}
              />
              <div className="mt-2">2. Next, install the workshop with the previous command. In this case, a TrainingPortal will be created automatically.</div>
              <div className="mt-2">3. Access the workshop.</div>
              <CopyableCodeBlock
                title="Access the workshop Command"
                command={`educates browse-workshops`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 