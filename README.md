# FinTrack Backend

## Author

- [Gabriel Alves](https://gabrielalv.es)
- LinkedIn: [Gabriel Alves](https://www.linkedin.com/in/gabriel-alfs)
- Github: [GabrielAlfs](https://github.com/GabrielAlfs)

## Overview

This is my attempt at a technical challenge proposed by Strider company at the Global Career Summit (May 2025) event, to build a lightweight financial transaction application based on Clean Architecture and Domain Driven Design in TypeScript.

## Features

### User Management

- Unique alphanumeric usernames (max length: 20 characters).
- Users can have one or more financial accounts.

### Account Management

- Each user has at least one financial account.
- Each account stores current balance as a consolidated value.
- Transactions are linked to specific accounts.

### Transaction Management

- Create transactions with type: INCOME, EXPENSE, or REFUND.
- Filter transactions by:
  - Type (INCOME, EXPENSE, REFUND, or ALL).
  - Date range (start, end, or both).
- REFUND transactions must reference a valid existing transaction.
- Real-time balance update on transaction creation via atomic operation.
