const express = require('express');
const path = require('path');

const app = express();

// This tells Express: "serve files from the public folder"
app.use(express.static(path.join(__dirname, 'public')));

// When someone visits the homepage, send index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start listening on port 3000
app.listen(3000, () => {
  console.log('Server started! Go to http://localhost:3000');
});