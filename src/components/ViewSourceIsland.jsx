import { useState } from 'react';
import ViewSourceModal from './ViewSourceModal.jsx';

export default function ViewSourceIsland({ downloadUrl, sourceContent }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button className="btn btn-primary" type="button" onClick={() => setShow(true)}>
        View Source
      </button>
      <ViewSourceModal show={show} onClose={() => setShow(false)} downloadUrl={downloadUrl} sourceContent={sourceContent} />
    </>
  );
} 