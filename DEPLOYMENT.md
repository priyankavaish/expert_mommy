# Deploy Expert Mommy

Cloudflare Pages serves this Vite storefront and its same-origin API. D1 stores the shared catalogue, site images, admin data, and expiring login sessions. Customers enquire and confirm purchases on WhatsApp. The website does not process payments or automatically create orders.

## Publish

The Cloudflare Pages project is `expert-mommy` and the production branch is `production/cloudflare`. The Wrangler configuration binds the production D1 database as `DB`. Use an authorized account before running deployment commands.

1. Run `npm ci`, `npm test`, and `npm run build`.
2. Run `npx wrangler pages deploy dist --project-name expert-mommy --branch production/cloudflare`. This project uses Direct Upload, so a Git push alone does not deploy it.
3. For the initial admin setup, add an encrypted Production secret named `ADMIN_PASSWORD` under **Settings → Variables and Secrets** and deploy again. Use a unique password of at least 16 characters. Sign in at `/admin-login` with the email configured in `wrangler.jsonc`.
4. Verify the admin login and a catalogue change from a second browser. Then add `expertmommy.in` under **Custom domains** and complete nameserver setup at the registrar. Preserve any existing email DNS records before changing nameservers.

For a new database, apply `db/schema.sql` with `npx wrangler d1 execute DB --remote --file db/schema.sql` before deploying.

The deployed site uses a new shared database. Earlier product edits and images saved in a browser must be reapplied to the deployed catalogue. On the first run, the storefront retains the old browser's cart IDs, saves a separate local backup of the previous catalogue and images, and removes the legacy browser login data.

Use the Cloudflare Pages runtime for API testing. The plain Vite development server renders the storefront but does not serve the D1 API.

## Checks

Run `npm ci`, `npm test`, and `npm run build` with Node.js 24. The API tests run against in-memory SQLite with a D1-compatible adapter. Run a smoke test on the deployed Pages URL after configuring the real D1 binding.

Each save accepts up to 12 MiB and 25 new images. The admin editor compresses uploads. D1 retains uploaded images and serves them through cacheable URLs.
