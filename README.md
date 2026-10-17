# Daily Wallpaper

A brand-new Antarctic wallpaper every day: swans fishing in calm water, seals and a playful pup on the ice, aurora overhead. Colors, layout and the number of swans change daily.

- **No server, no API key, no data needed.** Each day's wallpaper is generated on your device from the date, so it works offline.
- **Offline-first.** Wallpapers are stored on the device (last 30 days). Without a connection you still see today's wallpaper if you opened the app earlier, or any past ones.
- **Installable.** Add it to your home screen like a normal app (PWA).
- **Save and share** any wallpaper as a JPEG sized to your screen.

## Put it online with GitHub Pages (free)

1. Create a new public repository on GitHub.
2. Upload every file in this folder to the repository root (keep the file names).
3. Go to **Settings > Pages**. Under **Branch** choose `main` and `/ (root)`, then **Save**.
4. After a minute, open `https://YOUR-USERNAME.github.io/YOUR-REPO/`.
5. Open it once with internet. After that it works offline.

## Install on your phone

- **Android (Chrome):** menu > **Install app**.
- **iPhone (Safari):** Share > **Add to Home Screen**.

## Set it as your wallpaper

Tap **Save wallpaper**, open the saved image in Photos, then use **Set as wallpaper**.

## Files

| File | Purpose |
|---|---|
| `index.html`, `style.css` | App screen |
| `app.js` | Daily generator, offline storage, save/share |
| `sw.js` | Service worker (offline app shell) |
| `manifest.webmanifest`, `icon-*.png`, `icon.svg` | Install settings and icons |

## Customize

- Add or edit color themes in the `THEMES` list in `app.js`.
- Change how many days are kept with `KEEP_DAYS`.
- To bump an update to users, change `CACHE` in `sw.js` (e.g. `daily-wallpaper-v2`).

## Optional: AI-generated photos

This version draws wallpapers procedurally, which is why it is free and offline. If you later want photorealistic AI images, add a GitHub Actions workflow that calls an image API once a day, commits the image to an `images/` folder, and have `app.js` download and cache it. That needs an API key stored as a GitHub secret.
