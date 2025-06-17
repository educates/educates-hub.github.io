import { useState } from 'react';
import InstallModal from './InstallModal.jsx';

export default function InstallIsland({ downloadUrl }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setShow(true)}>
        Install
      </button>
      <InstallModal
        show={show}
        onClose={() => setShow(false)}
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