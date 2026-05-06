<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Platform Notes

- `BUILD_TARGET=app` intentionally enables `output: 'export'` for the Capacitor/static build.
- Static export does not ship dynamic POST route handlers. The app build must set `NEXT_PUBLIC_API_URL` to the deployed web API base URL, such as the Vercel deployment, before AI routes can work in Capacitor.
- Do not treat missing local `/api/*` handlers in the static export as a bug unless the platform strategy changes.
