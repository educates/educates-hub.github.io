# EducatesHub

EducatesHub is a static site built with [Astro](https://astro.build/) and TypeScript that catalogs and showcases Educates Workshops. It provides a searchable, filterable, and visually rich interface inspired by ArtifactHub, with Educates branding and a responsive Bootstrap 5 UI.

## Features

- **Browse Workshops:** View a curated list of Educates YAML workshop definitions.
- **Search & Filter:** Instantly search and filter workshops by title, description, and labels.
- **Workshop Details:** See detailed info, release notes, and install instructions for each workshop.
- **Install Modal:** One-click install instructions with a copy-to-clipboard button.
- **Responsive Design:** Clean, modern UI using Bootstrap 5, with custom Educates branding.
- **About Page & Footer:** Includes project info, links, and a persistent footer.

## Project Structure

```
/
├── public/           # Static assets (images, favicon, etc.)
├── src/
│   ├── components/   # Astro UI components
│   ├── data/         # Workshop YAML files
│   ├── layouts/      # Main layout and shared UI
│   ├── pages/        # Astro pages (index, about, [slug])
│   └── utils/        # Data loader utilities
├── package.json      # Project dependencies and scripts
├── astro.config.mjs  # Astro configuration
└── Dockerfile        # Containerizing the app
```

## Getting Started (Locally)

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the dev server:**

   ```sh
   npm run dev
   ```

   The site will be available at [http://localhost:4321](http://localhost:4321) by default.

3. **Build for production:**
   ```sh
   npm run build
   ```
4. **Preview the production build:**
   ```sh
   npm run preview
   ```

## Running with Docker

1. **Build the Docker image:**
   ```sh
   docker buildx build --platform linux/amd64,linux/arm64 -t educates-hub .
   ```
2. **Run the container:**
   ```sh
   docker run -it --rm -p 4321:4321 educates-hub
   ```
3. **Open your browser:**
   Visit [http://localhost:4321](http://localhost:4321)

## Customizing Workshops

- Add or edit YAML files in `src/data/` to update the workshop catalog.
- Images referenced in YAML should be placed in `public/images/` or mapped in the loader utility.

## Contributing

Pull requests and issues are welcome! See the About page or visit [educates.dev](https://educates.dev) for more info.

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) or as specified by the Educates project.
