const express = require("express");
const router = express.Router();
const controllers = require("../controllers/car")

//Define les routes 
router.get('/cars', controllers.getCars)
router.get('/car/:id', controllers.getCarById);

module.exports = router;