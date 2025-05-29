import yaml from "yaml";

const imageMap: Record<string, string> = {
  kubernetes: "/images/k8s101.png",
  prometheus: "/images/prometheus.png",
  grafana: "/images/grafana.svg",
  argo: "/images/argo-cd.png",
  helm: "/images/helm.png",
  istio: "/images/istio.png",
  tekton: "/images/tekton.png",
  postgresql: "/images/postgresql.png",
  nginx: "/images/nginx.png",
  educates: "/images/educates.svg",
  spring: "/images/spring.png",
  java: "/images/java.png",
  docker: "/images/docker.png",
  // Add more mappings as needed
};

const educatesDefaultImage = "/images/educates.svg";

export interface Workshop {
  type: 'Workshop';
  slug: string;
  title: string;
  description: string;
  author: string;
  image: string;
  date_created?: string;
  version?: string;
  release_notes?: string;
  labels?: string[];
  install_url?: string;
  repo_url?: string;
  workshop_definition_url?: string;
  repo?: {
    org: string;
    name: string;
    tag?: string;
    path?: string;
    asset_name?: string;
    branch?: string;
  };
  [key: string]: any;
}

export interface ExtensionPackage {
  type: 'ExtensionPackage';
  slug: string;
  title: string;
  description: string;
  author: string;
  image: string;
  date_created?: string;
  version?: string;
  release_notes?: string;
  labels?: string[];
  repo_url?: string;
  [key: string]: any;
}

export interface EditorExtension {
  type: 'EditorExtension';
  slug: string;
  title: string;
  description: string;
  author: string;
  image: string;
  date_created?: string;
  version?: string;
  release_notes?: string;
  labels?: string[];
  repo_url?: string;
  [key: string]: any;
}

export interface KyvernoPolicy {
  type: 'KyvernoPolicy';
  slug: string;
  title: string;
  description: string;
  author: string;
  image: string;
  date_created?: string;
  version?: string;
  release_notes?: string;
  labels?: string[];
  repo_url?: string;
  [key: string]: any;
}

export type EducatesResourceBase = Workshop | ExtensionPackage | EditorExtension | KyvernoPolicy;

async function loadYamlDocuments<T extends EducatesResourceBase>(
  typeFilter: string
): Promise<T[]> {
  // Get all available images in public/images
  const imageFiles = import.meta.glob("/public/images/*", {
    query: "?url",
    import: "default",
    eager: true,
  });
  const availableImages = new Set(
    Object.keys(imageFiles).map((path) => path.replace("/public", "")),
  );

  const files = import.meta.glob("../data/*.yaml", {
    query: "?raw",
    import: "default",
  });
  const entriesNested = await Promise.all(
    Object.entries(files).map(async ([path, loader]) => {
      const raw = await loader();
      if (typeof raw !== "string") {
        throw new Error("Invalid YAML file");
      }
      const docs = yaml.parseAllDocuments(raw).map((doc) => doc.toJSON());
      // Derive slug from filename, but allow override in doc
      return docs
        .map((data, i) => {
          // Check if document is empty, and if so, skip it
          if (data === null || data === undefined) {
            return null;
          }
          let slug =
            data.slug ||
            (docs.length === 1
              ? path.split("/").pop()?.replace(".yaml", "") || ""
              : `${path.split("/").pop()?.replace(".yaml", "")}-${i + 1}`);
          let image = data.image;
          if (typeof image === "string" && imageMap[image]) {
            image = imageMap[image];
          }
          if (typeof image === "string" && !availableImages.has(image)) {
            image = educatesDefaultImage;
          }
          return { ...data, image, slug };
        })
        .filter((data) => {
          // Check if document is empty, and if so, skip it
          if (data === null || data === undefined) {
            return false;
          }
          return data.type === typeFilter;
        });
    }),
  );
  return entriesNested.flat() as T[];
}

export async function loadWorkshops(): Promise<Workshop[]> {
  return loadYamlDocuments<Workshop>('Workshop');
}

export async function loadExtensionPackages(): Promise<ExtensionPackage[]> {
  return loadYamlDocuments<ExtensionPackage>('ExtensionPackage');
}

export async function loadEditorExtensions(): Promise<EditorExtension[]> {
  return loadYamlDocuments<EditorExtension>('EditorExtension');
}

export async function loadKyvernoPolicies(): Promise<KyvernoPolicy[]> {
  return loadYamlDocuments<KyvernoPolicy>('KyvernoPolicy');
}

export async function loadEducatesResources(): Promise<EducatesResourceBase[]> {
  const [workshops, extensionPackages, editorExtensions, kyvernoPolicies] = await Promise.all([
    loadWorkshops(),
    loadExtensionPackages(),
    loadEditorExtensions(),
    loadKyvernoPolicies(),
  ]);
  return [...workshops, ...extensionPackages, ...editorExtensions, ...kyvernoPolicies];
}

// Later, this can be replaced with a server-side loader or API endpoint that reads YAML files from /public/workshops
