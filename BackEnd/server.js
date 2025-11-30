const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define the port
const PORT = process.env.PORT || 5000;

// Ensure the PORT is set in process.env so the app can pick it up
process.env.PORT = PORT;

console.log(`Initializing server configuration...`);
console.log(`Target Port: ${PORT}`);

// Path to the built application
const distPath = path.join(__dirname, 'dist', 'index.js');
const fs = require('fs');

// Check if the build exists
if (!fs.existsSync(distPath)) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: dist/index.js not found.');
    console.error('The application must be built before it can be run.');
    console.error('Please run: npm run build');
    process.exit(1);
}

// Start the application
console.log('Starting application...');
require(distPath);
