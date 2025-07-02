# Expense Tracker Backend

This is a backend API for an expense tracker application. It allows users to manage spaces (groups), add transactions, and view summaries of their expenses and incomes.

## Technology Stack

- **Node.js** (with [Bun](https://bun.sh/)): Fast JavaScript runtime for server-side applications.
- **TypeScript**: Strongly-typed JavaScript for better code quality and maintainability.
- **Hono**: Lightweight, fast web framework for building APIs.
- **Drizzle ORM**: Type-safe SQL ORM for database access.
- **PostgreSQL**: Relational database for storing spaces and transactions.

## Features

- Create and manage spaces (groups for transactions)
- Add, update, soft-delete transactions (with category, type, amount, etc.)
- Soft delete for both spaces and transactions (no hard deletes)
- Get summaries and category-wise spending
- Input validation and error handling

## Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- [PostgreSQL](https://www.postgresql.org/) database running locally or remotely
- Node.js (if you want to use Node for tooling, but Bun is required to run the app)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/parthnariya/expense-tracker-backend.git
cd expense-tracker-backend
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the `src/config` directory (or as specified in your codebase) and add your database connection string:

```
DATABASE_URL=postgres://username:password@localhost:5432/your_db_name
```

### 4. Run Database Migrations

If you are using Drizzle ORM migrations, run:

```bash
bun run drizzle:push
```

Or follow your project's migration instructions.

### 5. Start the Server

```bash
bun run dev
```

The server should now be running at `http://localhost:3000` (or your configured port).

## API Endpoints

- `POST /spaces` — Create a new space
- `GET /spaces/:id` — Get a space by ID
- `DELETE /spaces/:id` — Soft delete a space
- `POST /spaces/:spaceId/transactions` — Add a transaction
- `GET /spaces/:spaceId/transactions` — List transactions
- `PUT /spaces/:spaceId/transactions/:transactionId` — Update a transaction
- `DELETE /spaces/:spaceId/transactions/:transactionId` — Soft delete a transaction
- `GET /spaces/:spaceId/summary` — Get summary (income/expense)
- `GET /spaces/:spaceId/category-spending` — Get category-wise spending

## Notes

- All deletes are soft deletes (`is_deleted` flag).
- Make sure your database is running and accessible via the connection string.
- For development, you can use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test the API.

## License

MIT
