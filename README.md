# Basic Bare Bones ToDo App with Express Backend Server

This project serves as a simple ToDo app for testing API usage. While functional, it contains some less-than-ideal coding practices and should not be used as-is for production purposes.

> [!WARNING]
> This project contains bad habits and is not recommended to be used as-is. Please update and refactor the code before releasing it for any serious use.

## Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js** (version 16.x or later recommended)
- **npm** (comes with Node.js)
- **pm2** (for running the backend, install it globally if not already installed: `npm install -g pm2`)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate into the `hyghtask` folder:
   ```bash
   cd hyghtask
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

> [!TIP] 
> Ensure that all dependencies are successfully installed before proceeding.

## How to Start the App

### Backend

To start the backend server:

1. Run the following command:
   ```bash
   npm run start-s
   ```

2. The backend server is managed using **pm2**. To view logs, use:
   ```bash
   pm2 logs 0
   ```

### Frontend

To start the frontend:

1. Run the following command:
   ```bash
   npm run start
   ```

> [!TIP] 
> The frontend and backend are configured to work together. Ensure both are running simultaneously for proper functionality.

## Additional Notes

- **Environment Variables:**
  Ensure you have properly configured any required environment variables for both the backend and frontend. Refer to the `.env` files or configuration section in the code if necessary.

- **Port Conflicts:**
  By default, the backend and frontend may run on specific ports (e.g., `localhost:5000` for the backend). Make sure these ports are available or update the configurations to use different ports if needed.

- **Further Development:**
  While the project is functional, it's highly recommended to refactor the code and improve its architecture for better maintainability and scalability.

Happy Coding!

