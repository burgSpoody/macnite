# MacNite Roadmap

## Phase 1 — Foundation & Design:
- [x] Finalizing the `applist.json` schema
- [x] Designing the website's output `selection.json` schema
- [x] Deciding on the config hosting solution
- [x] Sketching out the website UI (categories, checkboxes, install button)
- [ ] Sketching out the Mac app UI (app list, progress bars, install log)
- [x] Choosing app name, URL scheme (`macnite://`), and bundle ID

## Phase 2 — The Website:
- [ ] Build the category + app selection UI
- [ ] Load `applist.json` dynamically to populate the UI (so adding apps later only requires editing the JSON)
- [ ] Implement selection state (checkboxes, select all per category, etc.)
- [ ] Generate the `selection.json` from the user's choices
- [ ] POST the selection JSON to your backend and get back a config URL
- [ ] Implement the `macnite://` URL trigger with the `setTimeout` fallback
- [ ] Build the "Install MacNite first" fallback UI for first-time users
- [ ] Host the website (GitHub Pages, Vercel, Netlify — all free)

## Phase 3 — The Backend (Lightweight):
- [ ] Create a serverless function that accepts a `selection.json` POST
- [ ] Store it with a short UUID key (expires after e.g. 24 hours)
- [ ] Return a fetchable URL like `https://yoursite.com/configs/abc123.json`
- [ ] Create a GET endpoint so the Mac app can fetch the config by UUID

## Phase 4 — The Mac App: Data Layer:
- [ ] Set up the Xcode project with the right bundle ID and entitlements
- [ ] Register the `macnite://` URL scheme in `Info.plist`
- [ ] Parse `applist.json` from GitHub into Swift models
- [ ] Fetch and parse the remote `selection.json` from the config URL
- [ ] Write the matching logic — map selected IDs to full app entries
- [ ] Write the "already installed" checker using `bundleId` (via `NSWorkspace`)

## Phase 5 — The Mac App: Installer Logic:
- [ ] Download files using `URLSession` with progress tracking
- [ ] **DMG handler** — mount with `hdiutil attach`, find the `.app`, copy to `/Applications`, unmount with `hdiutil detach`
- [ ] **PKG handler** — run with `installer -pkg ... -target /` via `Process`
- [ ] **ZIP handler** — unzip with `Process` + `unzip`, move `.app` to `/Applications`
- [ ] Handle errors gracefully (failed download, wrong file, no permissions)
- [ ] Queue installs sequentially (safer than parallel for system-level operations)

## Phase 6 — The Mac App: SwiftUI Interface:
- [ ] Launch screen / waiting state (before config URL arrives)
- [ ] App list view — show what's about to be installed
- [ ] Per-app progress rows (downloading → installing → done / failed)
- [ ] Overall progress indicator
- [ ] Install log / detail view for power users
- [ ] Completion screen with summary (X installed, Y failed)
- [ ] Handle the `onOpenURL` entry point cleanly in `@main`

## Phase 7 — Polish & Edge Cases:
- [ ] What happens if MacNite is already open when the URL is triggered?
- [ ] What if a download URL changes or goes dead?
- [ ] What if the user doesn't have admin privileges?
- [ ] App already installed — skip or offer to reinstall?
- [ ] Retry failed installs
- [ ] Test on both Intel and Apple Silicon Macs
- [ ] Test with DMG, PKG, and ZIP type apps

## Phase 8 — Distribution:
- [ ] Code-sign the app with your Apple Developer ID (required for Gatekeeper)
- [ ] Notarize the app with Apple (required outside the App Store)
- [ ] Package MacNite itself as a DMG for distribution
- [ ] Host the MacNite DMG on your website
- [ ] Write a simple onboarding guide for first-time users
