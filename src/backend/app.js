const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors({
    origin: "*"
}))

const carsRoutes = require('./routes/cars')
app.use(sneakerRoutes);


//route
app.listen(port, () => {
    console.log(`Example app litening at http://localhost:${port}`);
});
