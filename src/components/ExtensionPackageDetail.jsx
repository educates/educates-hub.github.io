import { useState, useEffect } from 'react';
import ViewSourceIsland from './ViewSourceIsland.jsx';
import InstallIsland from './InstallIsland.jsx';
import { Octokit } from 'octokit';

export default function ExtensionPackageDetail({ extensionPackage }) {
  const [showInstall, setShowInstall] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [assetId, setAssetId] = useState("");

  // useEffect(() => {
  //   async function fetchDownloadUrl() {
  //     if (extensionPackage.repo && extensionPackage.repo.org && extensionPackage.repo.name && extensionPackage.repo.asset_name) {
  //       try {
  //         const octokit = new Octokit();
  //         const res = await octokit.rest.repos.getReleaseByTag({
  //           owner: extensionPackage.repo.org,
  //           repo: extensionPackage.repo.name,
  //           tag: extensionPackage.repo.tag || 'latest',
  //         });
  //         const asset = res.data.assets.find(asset => asset.name === extensionPackage.repo.asset_name);
  //         if (asset) {
  //           setDownloadUrl(asset.browser_download_url);
  //           setAssetId(asset.id);
  //         } else {
  //           setDownloadUrl("");
  //           setAssetId("");
  //         }
  //       } catch (e) {
  //         setDownloadUrl("");
  //         setAssetId("");
  //       }
  //     } else {
  //       setDownloadUrl("");
  //       setAssetId("");
  //     }
  //     console.log("downloadUrl", downloadUrl);
  //     console.log("assetId", assetId);
  //   }
  //   fetchDownloadUrl();
  // }, [extensionPackage]);

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '2000px' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-lg border-primary border-opacity-10 fade-in">
            <div className="row g-0 align-items-center">
              <div className="col-md-4 text-center p-4">
                <img
                  src={extensionPackage.image}
                  alt={extensionPackage.title}
                  className="img-fluid bg-light rounded mb-3"
                  style={{ maxHeight: 180, objectFit: 'contain' }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body d-flex flex-column h-100">
                  <h2 className="card-title h4 text-primary fw-bold mb-2">
                    {extensionPackage.title}
                  </h2>
                  <div className="mb-2">
                    {extensionPackage.labels &&
                      extensionPackage.labels.map((label) => (
                        <span key={label} className="badge bg-primary bg-opacity-10 text-primary fw-normal me-1 mb-1">
                          {label}
                        </span>
                      ))}
                  </div>
                  <p className="card-text text-secondary mb-2">
                    {extensionPackage.description}
                  </p>
                  <div className="text-muted small mb-1">
                    By {extensionPackage.author} • Created {extensionPackage.date_created}
                  </div>
                  <div className="text-muted small mb-1">
                    Version: {extensionPackage.version}
                  </div>
                  {/* Release Notes section, only if release_notes is not empty */}
                  {extensionPackage.release_notes && extensionPackage.release_notes.trim() !== '' && (
                    <div className="mt-3">
                      <h3 className="h6 text-primary mb-1">Release Notes</h3>
                      <div className="bg-light border rounded p-3 small text-secondary">
                        {extensionPackage.release_notes}
                      </div>
                    </div>
                  )}
                  {/* <div className="mt-4 d-flex gap-3">
                    <ViewSourceIsland client:load src={extensionPackage.workshop_definition_url} repo={extensionPackage.repo} assetId={assetId} downloadUrl={downloadUrl} />
                    <InstallIsland client:load installUrl={extensionPackage.install_url} extensionPackageSlug={extensionPackage.slug} downloadUrl={downloadUrl} />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 