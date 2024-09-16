# Bank Account Management REST API

This project contains an A NodeJS(typescript) & MongoDB bank accounts management REST API.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js (version 20.0.0 or later)
* You have installed MongoDB (version 8.0.0 or later)
* You have a Windows/Linux/Mac machine

## Installing and Running Locally

To install and run this project locally, follow these steps:

1. Clone the repository
   ```
   git clone https://github.com/goketech/bank-api.git
   ```

2. Navigate to the project directory
   ```
   cd bank-api
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/your-database-name
     JWT_SECRET=your-secret-key
     ```
   Replace `your-database-name` and `your-secret-key` with your preferred values.

   You could also create MongoDB Atlas account and replace `mongodb://localhost:27017/your-database-name` with your connection URL.

5. Start MongoDB
   - Make sure your MongoDB server is running

6. Run the application
   - For development:
     ```
     npm run dev
     ```
   - For production:
     ```
     npm start
     ```

The server should now be running on `http://localhost:3000` (or whatever port you specified in the .env file).

## Running Tests

To run tests, use the following command:

```
npm test
```

## Linting and Formatting

This project uses ESLint and Prettier for code linting and formatting. To run these:

- Lint the code:
  ```
  npm run lint
  ```
- Fix linting issues:
  ```
  npm run lint:fix
  ```
- Format the code:
  ```
  npm run format
  ```

## API Documentation

Brief description of your API endpoints. For example:

- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login a user
- `GET /api/v1/accounts`: Get all accounts (requires authentication)
- `POST /api/v1/accounts`: Create a new account (requires authentication)
- `GET /api/v1/accounts/:accountNumber`: Search for an account by number
- `POST /api/v1/transactions`: Create a new transaction (requires authentication)
- `GET /api/v1/transactions`: Get all user transactions across all acounts (requires authentication)
- `GET /api/v1/transactions/:accountNumber`: Get transaction details associated with an account (requires authentication)

For more detailed API documentation, refer to [Latest Documentation](/docs).

## Contributing

If you want to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Create a new Pull Request

## Contact

If you have any questions or feedback, please contact [Modupe](mailto:modupe775@gmail.com).

## License

This project uses the following license: [ISC](./LICENSE).