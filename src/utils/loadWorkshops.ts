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

export async function loadWorkshops() {
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
      return docs.map((data, i) => {
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
      });
    }),
  );
  return entriesNested.flat();
}

// Later, this can be replaced with a server-side loader or API endpoint that reads YAML files from /public/workshops
