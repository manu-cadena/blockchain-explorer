# Blockchain Explorer

A simple blockchain explorer built with vanilla JavaScript that allows users to interact with Ethereum-based networks (Ganache or testnet). The application implements Object-Oriented Programming principles and follows best practices for code organization and testing.

## Features

- Real-time block information display
- Account balance checking in ETH
- Transaction creation and submission
- Detailed block information with modal view
- Transaction history tracking

## Technical Implementation

### Architecture

- Implements Object-Oriented Programming with inheritance
- Uses ES6 modules for code organization
- Follows Separation of Concerns (SOC) principle
- Base class architecture with `BlockchainService`

### Services

- `BlockService`: Handles block retrieval and display
- `BalanceService`: Manages account balance checks
- `TransactionService`: Handles transaction creation and history

### Testing

- Unit tests implemented with Vitest
- Mock implementations for blockchain interactions
- Test coverage for success and error scenarios

## Prerequisites

- Node.js installed on your machine
- Ganache for local blockchain testing
- A modern web browser

## Installation

1. Clone the repository:

```bash
git clone https://github.com/manu-cadena/blockchain-explorer.git
```
