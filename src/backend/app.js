const express = require('express');
const app = express();
const port = 8080;

// Add body-parser middleware
app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: "*"
}))

const carsRoutes = require('./routes/cars')
app.use(carsRoutes);

//route
app.listen(port, () => {
    console.log(`Example app litening at http://localhost:${port}`);
});
