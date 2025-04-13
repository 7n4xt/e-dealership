const data = require("../data.json");

// Get all cars
exports.getCars = (_, res) => {
    try {
        if (!data.cars || !Array.isArray(data.cars)) {
            return res.status(500).json({
                status: "error",
                message: "Invalid data structure"
            });
        }

        return res.status(200).json({
            status: "success",
            data: data.cars
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

// Get car by ID
exports.getCarById = (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid ID format"
            });
        }

        const car = data.cars.find(car => car.id === id);

        if (!car) {
            return res.status(404).json({
                status: "error",
                message: "Car not found"
            });
        }

        return res.status(200).json({
            status: "success",
            data: car
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

