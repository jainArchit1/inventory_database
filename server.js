require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/supplier', supplierRoutes);
app.use('/inventory', inventoryRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send("Welcome to the Inventory API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
