# BookLeaf Author Support & Communication Portal

A full-stack demonstration project for the BookLeaf Publishing Full-Stack Developer assignment. It includes an author portal, an admin ticket queue, role-based API access, AI-assisted classification/priority/draft generation, and a rules-based fallback when the LLM service is unavailable.

> **Confidential assignment:** keep this repository private. Do not publish this solution to a public repository.

## Stack
- Frontend: React + Vite
- API: Node.js + Express
- Persistence: local JSON file for this take-home prototype (not suitable for multi-instance production deployment)
- Authentication: bcrypt password hashes + signed JWT, 12-hour expiry
- AI: OpenAI Chat Completions API (configurable model; defaults to `gpt-4o-mini`) with deterministic fallback

## Run locally
Requires Node.js 20+ and npm.

1. Copy `server/.env.example` to `server/.env`.
2. Set a long random `JWT_SECRET`. Add `OPENAI_API_KEY` if you want live LLM calls. The app still works without it using the fallback classifier/drafter.
3. From the project root run:

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`. API health: `http://localhost:4000/api/health`.

### Demo credentials
- Author: `priya@example.com` / `password`
- Admin: `admin@bookleaf.local` / `password`

These credentials are only for local evaluation. Change them and seed proper users before any public deployment.

## Core flows
- Authors can sign in, view their own books, create tickets, see ticket statuses and support replies.
- Ticket creation validates input and checks that a selected book belongs to the signed-in author.
- Admins can see the ticket queue, filter by status/category/priority, override classification and priority, change status, assign a ticket to themselves, add internal-only notes, regenerate a response draft, edit it, and send the final reply.
- Author/admin route access is enforced by the API, not only by frontend navigation.
- Tickets are created even if the AI API fails; a rules-based fallback supplies a category, priority and draft.

## AI approach
The server sends the ticket subject and description plus a concise BookLeaf policy knowledge base. The prompt constrains category/priority values, asks for empathetic and specific communication, and forbids inventing account-specific payout dates or claiming actions have already happened. The server validates the returned JSON schema. The admin must review/edit the draft; no AI response is automatically sent to an author.

Cost awareness: only the ticket content and compact policy context are sent, not the full ticket history or all books. The model and output token budget are configurable. In production, add rate limiting, request timeouts, retry/backoff, usage logging and per-ticket AI-call limits. Fallback behavior is built in.

## API overview
All protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Sign in and receive JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/books` | Author's own books; admin sees all |
| GET | `/api/tickets` | Ticket list; admin filters with `status`, `category`, `priority` |
| POST | `/api/tickets` | Create ticket and classify it |
| GET | `/api/tickets/:id` | Ticket details with access checks |
| PATCH | `/api/tickets/:id` | Admin status/category/priority/assignment update |
| POST | `/api/tickets/:id/reply` | Admin sends author-visible reply |
| POST | `/api/tickets/:id/notes` | Admin-only internal note |
| POST | `/api/tickets/:id/draft` | Admin regenerates AI draft |
| GET | `/api/health` | Health check |

## Dataset note
The assignment states that a separate `bookleaf_sample_data.json` file contains 10 authors and 18 books and asks that exact dataset be seeded. That companion JSON file was not included with the PDF available to this workspace, so this repository currently includes clearly illustrative demo records only. **Before submitting, import the official companion dataset** and update the seed/auth mapping so all 10 authors and 18 books match the provided records. Do not represent the illustrative records as the official dataset.

## Deployment
For a demo, deploy the API and frontend separately (e.g. Render for the API and Vercel for the client). Set `CLIENT_ORIGIN` on the API to the deployed frontend origin, and `VITE_API_URL` at client build time to the API's `/api` URL. Configure `PORT`, `JWT_SECRET`, and `OPENAI_API_KEY` as platform environment variables. The JSON file store is ephemeral on many hosts and does not support concurrent writes; migrate to PostgreSQL before deployment on a host with multiple instances or any production use. Do not include `.env` in the repository.

## Known limitations / next steps
1. Replace JSON persistence with PostgreSQL and migrations; seed the exact official dataset.
2. Add production-grade password setup/reset, rate limiting, account lockout, secure cookies or carefully managed token storage, audit logs, and stronger secret management.
3. Add SSE/WebSocket updates. The current client refreshes data when navigating/reloading; real-time push is not implemented yet.
4. Implement real attachment uploads with size/type validation and private object storage; current UI intentionally omits uploads.
5. Add automated API/UI tests, OpenAPI/Swagger generation, pagination, robust logging/monitoring, and accessible error focus management.
6. Add AI evaluation fixtures, prompt/version tracking, token/cost telemetry, timeouts and moderation/PII controls.

## Submission checklist
- [ ] Import the exact `bookleaf_sample_data.json` supplied alongside the assignment.
- [ ] Change demo credentials/secrets for the evaluation environment.
- [ ] Run and test both author and admin flows.
- [ ] Deploy and test a live URL.
- [ ] Create a **private** repository and add the collaborator email BookLeaf provides.
- [ ] Include the live URL and test credentials in the private README.
- [ ] Add the one-page approach/trade-offs/production-evolution write-up requested by the assignment.
