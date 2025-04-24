const express = require("express");
const router = express.Router();
const controllers = require("../controllers/car");
const path = require('path');

// Define routes 
router.get('/cars', controllers.getCars);
router.get('/car/:id', controllers.getCarById);
router.post('/car/updateStock', controllers.updateStock);

// Serve images from the img directory
router.get('/img/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '../img', imageName);
    res.sendFile(imagePath);
});

module.exports = router;