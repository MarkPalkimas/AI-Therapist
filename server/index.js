// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const therapyRoutes = require('./routes/therapy');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('client'));

// Connect to MongoDB (adjust the URI as needed)
mongoose.connect('mongodb://localhost:27017/therapeutic_ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Routes
app.use('/api/therapy', therapyRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
