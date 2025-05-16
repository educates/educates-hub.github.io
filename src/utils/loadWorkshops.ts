import yaml from 'yaml';

const imageMap: Record<string, string> = {
  kubernetes: '/images/k8s101.png',
  prometheus: '/images/prometheus.png',
  grafana: '/images/grafana.svg',
  argo: '/images/argo-cd.png',
  helm: '/images/helm.png',
  istio: '/images/istio.png',
  tekton: '/images/tekton.png',
  postgresql: '/images/postgresql.png',
  nginx: '/images/nginx.png',
  educates: '/images/educates.svg',
  // Add more mappings as needed
};

const educatesDefaultImage = '/images/educates.svg';

export async function loadWorkshops() {
  // Get all available images in public/images
  const imageFiles = import.meta.glob('/public/images/*', { as: 'url', eager: true });
  const availableImages = new Set(
    Object.keys(imageFiles).map((path) => path.replace('/public', ''))
  );

  const files = import.meta.glob('../data/*.yaml', { as: 'raw' });
  const entries = await Promise.all(
    Object.entries(files).map(async ([path, loader]) => {
      const raw = await loader();
      const data = yaml.parse(raw);
      // Derive slug from filename
      const slug = path.split('/').pop()?.replace('.yaml', '') || '';
      // Image logic: if image is a string key in imageMap, use mapped path; else use as path
      let image = data.image;
      if (typeof image === 'string' && imageMap[image]) {
        image = imageMap[image];
      }
      // If the image path does not exist, use the default image
      if (typeof image === 'string' && !availableImages.has(image)) {
        image = educatesDefaultImage;
      }
      return { ...data, image, slug };
    })
  );
  return entries;
}

// Later, this can be replaced with a server-side loader or API endpoint that reads YAML files from /public/workshops 