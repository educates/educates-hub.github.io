import { useState } from 'react';
import InstallModal from './InstallModal.jsx';

export default function InstallIsland({ installUrl, workshopSlug, downloadUrl }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button className="btn btn-success" type="button" onClick={() => setShow(true)}>
        Install
      </button>
      <InstallModal
        show={show}
        onClose={() => setShow(false)}
        installUrl={installUrl}
        workshopSlug={workshopSlug}
        downloadUrl={downloadUrl}
      />
      {show && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={() => setShow(false)}
        ></div>
      )}
    </>
  );
} 