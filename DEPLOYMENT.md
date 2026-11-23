# Deploy Expert Mommy

Cloudflare Pages serves this Vite storefront and its same-origin API. D1 stores the shared catalogue, site images, admin data, and expiring login sessions. Customers enquire and confirm purchases on WhatsApp. The website does not process payments or automatically create orders.

## Publish

1. Create a Cloudflare Pages Git project for `priyankavaish/expert_mommy`. Set the production branch to `main`, build command to `npm run build`, and output directory to `dist`.
2. Create a D1 database and run the SQL in `db/schema.sql` on it. Bind it to the Pages project as `DB`. Use a separate database for Preview if enabling Preview access.
3. In the project's Production variables and secrets, set `ADMIN_EMAIL` and an encrypted `ADMIN_PASSWORD`. Generate a unique password of at least 16 characters with a password manager. Redeploy after setting bindings and secrets.
4. On the Pages preview URL, verify the storefront, admin sign-in, and a shared catalogue edit from a second browser. Then add `expertmommy.in` as a custom domain and verify DNS and HTTPS. Confirm existing email records before changing nameservers.
5. Sign in at `/admin-login` to manage photos, stock and prices. The bundled catalogue is the starting point until the first admin save.

The deployed site uses a new shared database. Earlier product edits and images saved in a browser must be reapplied to the deployed catalogue. On the first run, the storefront retains the old browser's cart IDs, saves a separate local backup of the previous catalogue and images, and removes the legacy browser login data.

Use the Cloudflare Pages runtime for API testing. The plain Vite development server renders the storefront but does not serve the D1 API.

## Checks

Run `npm ci`, `npm test`, and `npm run build` with Node.js 24. The API tests run against in-memory SQLite with a D1-compatible adapter. Run a smoke test on the deployed Pages URL after configuring the real D1 binding.

Each save accepts up to 12 MiB and 25 new images. The admin editor compresses uploads. D1 retains uploaded images and serves them through cacheable URLs.
