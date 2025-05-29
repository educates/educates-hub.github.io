import { useState } from 'react';
import ViewSourceModal from './ViewSourceModal.jsx';

export default function ViewSourceIsland({ src, repo, assetId, downloadUrl }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button className="btn btn-primary" type="button" onClick={() => setShow(true)}>
        View Source
      </button>
      <ViewSourceModal show={show} onClose={() => setShow(false)} src={src} repo={repo} assetId={assetId} downloadUrl={downloadUrl} />
    </>
  );
} 