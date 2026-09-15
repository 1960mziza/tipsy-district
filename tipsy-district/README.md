# Tipsy District — website + CMS

## What's in here
- `index.html`, `css/`, `js/` — the site itself
- `data/products.json` — your product catalogue (edited via the CMS)
- `data/settings.json` — shop details: about text, delivery info, address, hours, WhatsApp number
- `admin/` — the free CMS (Decap CMS) you'll use to add/remove products, no code needed
- `assets/logo.svg` — your logo

## Part 1 — Put this on GitHub (needed for the CMS to save changes)
The CMS saves your edits by committing them to a Git repository, so the site needs to
live on GitHub (not just a drag-and-drop upload) for editing to work.

1. Create a free GitHub account at github.com if you don't have one.
2. Create a new **public or private repository**, e.g. `tipsy-district`.
3. Upload all the files in this folder to that repository (drag and drop on
   github.com works fine, or use `git push` if you're comfortable with it).

## Part 2 — Deploy on Netlify (free)
1. Go to netlify.app and sign up free, using your GitHub account.
2. Click **Add new site → Import an existing project → GitHub**, and pick your
   `tipsy-district` repo.
3. Build settings: leave the build command empty and set the publish directory to `.`
   (this is already set in `netlify.toml`).
4. Click **Deploy**. In a minute your site will be live at something like
   `https://tipsy-district-xyz.netlify.app`. You can rename this or add your own
   domain later in Site settings → Domain management.

## Part 3 — Turn on the CMS login
1. In your Netlify site dashboard: **Integrations → Identity → Enable Identity**.
2. Still under Identity → **Settings and usage**: set registration to **Invite only**
   (so random people can't sign up), and enable **Git Gateway** in the same panel.
3. Go to **Identity** tab and click **Invite users** — invite yourself (and your
   attendant, if they'll also edit products) by email.
4. Check your email and accept the invite — it'll ask you to set a password.
5. Open `admin/config.yml` in the repo and replace `YOUR-SITE-NAME` in the two
   `site_url` / `display_url` lines with your actual Netlify site address, then
   save/commit.

## Part 4 — Add or remove products
1. Visit `https://your-site.netlify.app/admin/`
2. Log in with the email/password from your invite.
3. Click **Product Catalog** to add, edit, reorder or delete items — set the name,
   category, tasting note, size, price and photo.
4. Click **Shop Settings** to update your about text, delivery info, address, hours
   or WhatsApp number any time.
5. Hit **Publish** — changes go live on the site within a minute or two.

## Notes
- The WhatsApp number is already set to `0110161045` (as `254110161045`, Kenya's
  country code). Change it any time in Shop Settings.
- Product photos are optional — the shelf list works fine with just names, notes
  and prices, styled like a bar menu.
- The map on the Location section points to Tipsy District on Kwandege Street via
  Google Maps — no API key needed.
