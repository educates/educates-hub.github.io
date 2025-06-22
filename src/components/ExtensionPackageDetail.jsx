import { useState, useEffect } from 'react';
import InstallIsland from './InstallIsland.jsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Clipboard, X } from 'react-bootstrap-icons';
import { fetchSourceFile, handleDownloadSourceFile, parseOciUrl } from '../utils/sources.ts';

export default function ExtensionPackageDetail({ extensionPackage }) {


  const { repo, prefix, version, destination } = parseOciUrl(extensionPackage.oci_image);

  const sampleSourceCopyContent =
    `     packages:
        - name: ${extensionPackage.slug}
          files:
            - path: .
              image:
                url: ${extensionPackage.oci_image}`

  const sampleSource =
    `  apiVersion: training.educates.dev/v1beta1
  kind: Workshop
  metadata:
    name: "your-workshop"
  spec:
    ...
    workshop:
      files:
        - image:
            url: $(image_repository)/your-workshop-files:$(workshop_version)
          path: .
  ${sampleSourceCopyContent}
    ...`


  const sampleSourceWithCacheCopyContent =
    `    packages:
      - name: ${extensionPackage.slug}
        files:
          - path: .
            image:
              url: $(oci_image_cache)/${destination}:${version}`

  const sampleSourceWithCache =
    `  apiVersion: training.educates.dev/v1beta1
  kind: Workshop
  metadata:
    name: "your-workshop"
  spec:
    ...
    workshop:
      files:
        - image:
            url: $(image_repository)/your-workshop-files:$(workshop_version)
          path: .
  ${sampleSourceWithCacheCopyContent}
    ...`

  const ociImageCacheCopyContent = `environment:
    images:
      registries:
        - content:
            - destination: ${destination}
              prefix: ${prefix}
              stripPrefix: true
          onDemand: true
          urls:
            - https://${repo}`

  const ociImageCache = `...
  ${ociImageCacheCopyContent}
  ...`

  useEffect(() => {
    async function fetchSource() {
      const source = await fetchSourceFile("extension-packages", extensionPackage.slug);
      setSourceContent(source);
    }
    fetchSource();
  }, [extensionPackage]);

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
                    src={extensionPackage.image}
                    alt={extensionPackage.title}
                    className="img-fluid bg-light rounded me-3"
                    style={{ maxHeight: 100, maxWidth: 120, objectFit: 'contain', border: '1px solid #bcd' }}
                  />
                  <div className="flex-grow-1">
                    <h2 className="h4 text-primary fw-bold mb-1">{extensionPackage.title}</h2>
                    <div>
                      {extensionPackage.labels && extensionPackage.labels.map((label) => (
                        <span key={label} className="badge bg-primary bg-opacity-10 text-primary fw-normal me-1 mb-1">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded p-3 mb-3">
                  <div className="fw-bold mb-1">DESCRIPTION:</div>
                  <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{extensionPackage.description}</div>
                </div>
                {extensionPackage.release_notes && extensionPackage.release_notes.trim() !== '' && (
                  <div className="bg-white rounded p-3 mb-3">
                    <div className="fw-bold mb-1">RELEASE NOTES:</div>
                    <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{extensionPackage.release_notes}</div>
                  </div>
                )}
                {extensionPackage.oci_image && (  // Only show if the extension package has an OCI image
                <div className="bg-white rounded p-3 mb-3 position-relative" style={{ minHeight: 200 }}>
                  <div className="fw-bold mb-1">USING THE EXTENSION PACKAGE:</div>
                  <div className="text-secondary">Add to your workshop:</div>
                  <div className="d-flex align-items-center justify-content-end mb-1">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                      title="Copy Source"
                      onClick={() => { navigator.clipboard.writeText(sampleSourceCopyContent) }}
                    >
                      <Clipboard size={18} /> Copy YAML
                    </button>
                  </div>
                  <div className="text-secondary">
                    <SyntaxHighlighter
                      language="yaml"
                      customStyle={{ fontSize: '0.95em', margin: 0, padding: 0 }}
                      wrapLongLines={true}
                      showLineNumbers={true}
                      wrapLines={true}
                      lineProps={lineNumber => {
                        let style = { display: 'block' };
                        if (lineNumber >= 12 && lineNumber <= 17) {
                          style.backgroundColor = '#dbffdb';
                        }
                        return { style };
                      }}
                    >
                      {sampleSource}
                    </SyntaxHighlighter>
                  </div>
                  <div className="text-secondary pt-5">
                    Note that typically you would cache the extension images locally to speed up the process. For that you can use
                    Educates built in <a href="https://docs.educates.dev/docs/workshops/workshop-configuration/workshop-configuration/#image-caching" target="_blank" rel="noopener noreferrer">OCI image cache</a>&nbsp;
                    functionality, in that case, replace the extension package image reference
                    with the local image reference.
                  </div>
                  <div className="d-flex align-items-center justify-content-end mb-1 mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                      title="Copy Source"
                      onClick={() => { navigator.clipboard.writeText(sampleSourceWithCacheCopyContent) }}
                    >
                      <Clipboard size={18} /> Copy YAML
                    </button>
                  </div>
                  <div className="text-secondary">
                    <SyntaxHighlighter
                      language="yaml"
                      customStyle={{ fontSize: '0.95em', margin: 0, padding: 0 }}
                      wrapLongLines={true}
                      showLineNumbers={true}
                      wrapLines={true}
                      lineProps={lineNumber => {
                        let style = { display: 'block' };
                        if (lineNumber >= 12 && lineNumber <= 17) {
                          style.backgroundColor = '#dbffdb';
                        }
                        return { style };
                      }}>
                      {sampleSourceWithCache}
                    </SyntaxHighlighter>
                  </div>
                  <div className="text-secondary pt-5">
                    This feature, makes the url of the extension on the previous snippet different than if you
                    were to fetch the upstream extension <b>{extensionPackage.oci_image}</b>&nbsp;
                    but the one from the cache <b>$(oci_image_cache)/{destination}:{version}</b>
                  </div>
                  <div className="d-flex align-items-center justify-content-end mb-1 mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                      title="Copy Source"
                      onClick={() => { navigator.clipboard.writeText(ociImageCacheCopyContent) }}
                    >
                      <Clipboard size={18} /> Copy YAML
                    </button>
                  </div>
                  <div className="text-secondary pt-2">
                    <SyntaxHighlighter
                      language="yaml"
                      customStyle={{ fontSize: '0.95em', margin: 0, padding: 0 }}
                      wrapLongLines={true}
                      showLineNumbers={true}
                      wrapLines={true}
                      lineProps={lineNumber => {
                        let style = { display: 'block' };
                        if (lineNumber >= 2 && lineNumber <= 11) {
                          style.backgroundColor = '#dbffdb';
                        }
                        return { style };
                      }}
                    >
                      {ociImageCache}
                    </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
              {/* Right: Actions and Repo Info */}
              <div className="col-md-4">
                {extensionPackage.repo_url && (
                  <div className="rounded p-3 mb-3">
                    <div className="fw-bold mb-1">REPOSITORY:</div>
                    <a className="btn btn-outline-primary btn-sm w-100" href={extensionPackage.repo_url} target="_blank" rel="noopener noreferrer">
                      Go to Repo
                    </a>
                  </div>
                )}
                {extensionPackage.oci_image && (
                  <div className="rounded p-3 mb-3">
                    <div className="fw-bold mb-1">OCI IMAGE:</div>
                    <div className="text-secondary">{extensionPackage.oci_image}</div>
                  </div>
                )}
                {(extensionPackage.author || extensionPackage.date_created || extensionPackage.version) && (
                  <div className="bg-white rounded p-3 mb-3">
                    {extensionPackage.author && <div><b>Author:</b> {extensionPackage.author}</div>}
                    {extensionPackage.date_created && <div><b>Date:</b> {new Date(extensionPackage.date_created).toLocaleDateString()}</div>}
                    {extensionPackage.version && <div><b>Version:</b> {extensionPackage.version}</div>}
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