#!/bin/bash
set -e

WORKSHOP_DIR="src/content/workshops"
ASSET_DIR="public/assets/workshops"
mkdir -p "$ASSET_DIR"

for yaml in "$WORKSHOP_DIR"/*.yaml*; do
  # Extract slug (first occurrence)
  slug=$(grep '^slug:' "$yaml" | head -n1 | awk '{print $2}')
  # Extract install_url (first occurrence)
  url=$(grep '^install_url:' "$yaml" | head -n1 | awk '{print $2}')
  if [ -z "$slug" ]; then
    echo "No slug found in $yaml, skipping."
    continue
  fi
  if [ -n "$url" ]; then
    outname="$slug.yaml"
    echo "Downloading $url to $ASSET_DIR/$outname"
    if curl -sSL --fail "$url" -o "$ASSET_DIR/$outname"; then
      echo "Downloaded successfully."
    else
      echo "Failed to download $url (not found or error)."
      rm -f "$ASSET_DIR/$outname"
    fi
  else
    echo "No install_url found in $yaml, skipping."
  fi
done 