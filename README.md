# BidVault

BidVault is a Next.js auction application with PostgreSQL-backed authentication, auction listings, bidding, OTP email verification, password reset, and a dashboard.

## Fixed in this version

- Repaired broken auction detail page state variables.
- Added missing home, search, single-auction, bid-history, and dashboard API routes.
- Fixed the `/forgot-password` route typo and `/api/me` client/server mismatch.
- Replaced the missing Socket.IO runtime with lightweight HTTP polling, so the project runs on a normal Next.js server without a custom Socket.IO server.
- Removed unavailable `lucide-react` and Socket.IO imports.
- Fixed the `bcrypt`/`bcryptjs` dependency mismatch.
- Added authentication to auction creation.
- Added PostgreSQL environment configuration.
- Removed the uploaded `.env` file containing credentials; use `.env.example`.
- Cleaned formatting and resolved ESLint/TypeScript errors.

## Setup

1. Install Node.js 20+.
2. Create a PostgreSQL database named `auction_db` and make sure your tables match the fields used by the app (`users`, `otp_verifications`, `auctions`, and `bids`).
3. Copy `.env.example` to `.env` and fill in your PostgreSQL, JWT, and SMTP values.
4. Install dependencies:

```bash
npm install
```

5. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation

The cleaned source passes ESLint and TypeScript checks with:

```bash
npm run lint
npx tsc --noEmit
```

A production Next.js build could not be executed in the packaging environment because the platform did not have the Next.js platform-specific SWC binary and external package downloads were unavailable. The source itself was checked with ESLint and TypeScript.
