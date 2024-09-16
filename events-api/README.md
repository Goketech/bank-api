# WebSocket Event Logger

This is a simple WebSocket service that logs interaction and error events to separate files. It's built with Node.js, Express, and the `ws` library for WebSocket functionality.

## Features

- WebSocket server for real-time communication
- Logs interaction events to `interactions.txt`
- Logs error events to `errors.txt`
- Serves static files from the `public` directory
- Provides HTTP endpoints to access log files

## Prerequisites

- Node.js (version 20.0.0 or higher)
- npm (version 9.6.4 or higher)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/goketech/bank-api.git
   ```

2. Navigate to the project directory:
   ```
   cd events-api
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Configuration

The server uses a configuration file located at `./config/config.js`. You can set the following options:

- `PORT`: The port number on which the server will run (default: 3001)

## Usage

1. Start the server:
   ```
   npm start
   ```

2. The server will start running on the configured port (default: 3001).

3. Connect to the WebSocket server at `ws://localhost:3001`.

4. Send JSON-formatted messages to log events:

   - For interaction events:
     ```json
     {"type": "event.interaction", "data": "Your interaction data here"}
     ```

   - For error events:
     ```json
     {"type": "event.error", "data": "Your error data here"}
     ```

5. Access log files via HTTP:
   - Interactions log: `http://localhost:3001/interactions.txt`
   - Errors log: `http://localhost:3001/errors.txt`

## File Structure

- `public/`: Directory for static files
  - `interactions.txt`: Log file for interaction events
  - `errors.txt`: Log file for error events
  - `index.html`: HTML file to create log events
- `config/`: Configuration files
  - `config.js`: Server configuration
- `utils/`: Utility functions
  - `logger.js`: Logging utility

## License

This project uses the following license: [ISC](./LICENSE).