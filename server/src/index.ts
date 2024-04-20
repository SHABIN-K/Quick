// Import the 'express' module
import express from 'express';
import db from './libs/prismaDb';

// Create an Express application
const app = express();

// Set the port number for the server
const port = 5000;

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send a response to the client
  res.send('Hello, TypeScript + Node.js + Express!');
});

async function createUser(email: string, name?: string) {
  return await db.user.create({
    data: {
      email,
      name,
    },
  });
}

// Usage
createUser('example@email.com', 'John Doe');

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});
