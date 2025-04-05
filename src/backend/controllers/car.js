const data = require("../data.json")


// get all cars 
exports.getCars = (req, res) => {
    const sneaker = data.cars;

    res.json(data.cars)
};


// get car by ID 
exports.getCarById = (req, res) => {
    const id = parseInt(req.params.id);

    const cars = data.cars
    const car = cars.find($ => $.id === id);

    if (car === undefined) {
        return res, status(404).json({
            message: "cars not found"
        });
    }

    res.status(200).json({
        message: "car found",
        car
    });
};

