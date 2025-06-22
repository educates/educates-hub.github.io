import { useRef, useState } from 'react';

export default function CopyableCodeBlock({ title, command }) {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const cmdRef = useRef(null);

  const handleCopy = () => {
    if (cmdRef.current) {
      const text = cmdRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 1500);
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-semibold">{title}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={handleCopy}
        >
          {copyStatus}
        </button>
      </div>
      <pre
        ref={cmdRef}
        className="bg-light p-3 rounded small text-secondary mb-3"
        style={{ userSelect: 'all' }}
      >
        {command}
      </pre>
    </>
  );
} 