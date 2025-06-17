export async function fetchSourceFile(type: string, slug: string): Promise<string> {
    if (type && slug) {
        try {
            const res = await fetch(`/assets/${type}/${slug}.yaml`);
            if (res.ok) {
                const text = await res.text();
                return text;
            } else {
                return "Source file not found.";
            }
        } catch (e) {
            return "Error loading source file.";
        }
    } else {
        return "";
    }
}

export function handleDownloadSourceFile(type: string, slug: string) {
    const assetPath = `/assets/${type}/${slug}.yaml`;
    const link = document.createElement('a');
    link.href = assetPath;
    link.download = `${slug}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function getRepoUrl(repository: { org?: string, name?: string }) {
    if (repository && repository.org && repository.name) {
        return `https://github.com/${repository.org}/${repository.name}`;
    }
    return null;
}

export function parseOciUrl(url: string | undefined | null): { repo: string, prefix: string, version: string, destination: string } {
    if (!url) {
        return { repo: '', prefix: '', version: '', destination: '' };
    }
    // Split off the version (after the last colon)
    const [main, version] = url.split(/:(?=[^:]*$)/);
    // The repo is the first segment before the first '/'
    const firstSlash = main.indexOf('/');
    const repo = main.substring(0, firstSlash);
    // The prefix is everything after the first slash
    const prefix = main.substring(firstSlash);
    // The destination is the last segment before the colon
    const segments = main.split('/');
    const destination = segments[segments.length - 1];
    return { repo, prefix, version, destination };
}

/*
Example usage:

const url = "ghcr.io/educates/educates-extension-packages/educates:v3.3.2";
const { repo, prefix, version, destination } = parseOciUrl(url);
console.log(repo);         // "ghcr.io"
console.log(prefix);       // "/educates/educates-extension-packages/educates"
console.log(version);      // "v3.3.2"
console.log(destination);  // "educates"
*/