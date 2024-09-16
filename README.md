# Bank API Project

This project consists of two main services:
1. Bank Account Management REST API
2. WebSocket Event Logger

Together, these services provide a comprehensive solution for managing bank accounts and logging events in real-time.

## Service 1: Bank Account Management REST API

A Node.js (TypeScript) & MongoDB-based REST API for managing bank accounts.

### Key Features
- User registration and authentication
- Account creation and management
- Transaction processing
- Detailed API documentation

## Service 2: WebSocket Event Logger

A real-time event logging service built with Node.js, Express, and WebSocket.

### Key Features
- WebSocket server for real-time communication
- Logs interaction and error events to separate files
- Serves static files and provides HTTP access to log files

## Prerequisites

- Node.js (version 20.0.0 or later)
- npm (version 9.6.4 or later)
- MongoDB (version 8.0.0 or later)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/goketech/bank-api.git
   ```

2. Navigate to the project directory:
   ```
   cd bank-api
   ```

3. Install dependencies for both services:
   ```
   cd bank-api && npm install
   cd ../events-api && npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `bank-api` directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/your-database-name
     JWT_SECRET=your-secret-key
     ```

5. Configure the WebSocket service:
   - Update the `PORT` in `events-api/config/config.js` if needed (default: 3001)

6. Start MongoDB server

7. Run both services:
   - For Bank API (in the `bank-api` directory):
     ```
     npm run dev
     ```
   - For Event Logger (in the `events-api` directory):
     ```
     npm start
     ```

## Usage

### Bank Account Management API
- Access the API at `http://localhost:3000`
- Use endpoints for user registration, login, account management, and transactions
- Refer to the [API Documentation](https://classical-elsie-gokeee-d08fef73.koyeb.app/docs) for detailed endpoint information

### WebSocket Event Logger
- Connect to the WebSocket server at `ws://localhost:3001`
- Send JSON-formatted messages to log events
- Access logs via HTTP at:
  - `http://localhost:3001/interactions.txt`
  - `http://localhost:3001/errors.txt`

## Development

### Running Tests (Bank API)
```
npm test
```

### Linting and Formatting (Bank API)
```
npm run lint
npm run lint:fix
npm run format
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Create a new Pull Request

## Contact

For questions or feedback, please contact [Modupe](mailto:modupe775@gmail.com).

## License

This project is licensed under the [ISC License](./LICENSE).