# Demonology

A Biblical Study of the Unseen Realm.

A Christian research archive dedicated to Biblical demonology, fallen angels, spiritual warfare, demonic entities and supernatural deception, supported by Scripture, historical records and scholarly references.

## Development

Node.js 22.12 or newer is required.

```sh
npm install
npm run dev
npm run check
npm run build
npm test
```

The static build is generated in dist/. After validation, deploy the built directory with the authenticated Cloudflare CLI (`cf deploy ./dist`). Do not use automatic framework detection for Astro 6 during the current CLI beta. No Cloudflare resources are provisioned by this branch. Development pages carry noindex metadata; public indexing requires owner approval.

See [AGENTS.md](AGENTS.md) for project governance, [research methodology](docs/research-methodology.md) for evidence and citation standards, and [roadmap](docs/roadmap.md) for planned delivery.

Current status: v0.1.0 foundation under review, not a public release. No licence has been granted for original code or editorial content; third-party materials retain their own rights.
