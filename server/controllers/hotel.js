const Hotel = require("../models/Hotel.js");
const ErrorResponse = require("../utils/errorResponse.js");

module.exports.postHotel = async function (req, res, next) {
    const { username } = req.user;

    function setProps(request, username) {
        request.postBy = username;

        return request;
    }

    try {
        if (!req.body) {
            return next(new ErrorResponse(`Please provide a detail of your target hotel!`, 400));
        } else {
            const request = setProps(req.body, username);
            const hotel = new Hotel(request);

            try {
                const data = await hotel.save();

                await res.status(201).json({
                    success: true,
                    status: `CREATED`,
                    message: `Hotel created successfully with Username : ${username}`,
                    data: data,
                });
            } catch (error) {
                next(new ErrorResponse(`Something went wrong on create a new hotel! Error: ${error}`, 400));
            }
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.updateHotel = async function (req, res, next) {
    const params = req.params.id;
    const request = req.body;
    try {
        const hotel = await Hotel.findByIdAndUpdate(params, { $set: request}, {new: true});

        if (!hotel) {
            return next(new ErrorResponse(`Hotel with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(201).json({
                success: true,
                status: `UPDATED`,
                message: `Hotel updated successfully with given ID : ${params}`,
                data: hotel,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.deleteHotel = async function (req, res, next) {
    const params = req.params.id;
    try {
        const hotel = await Hotel.findByIdAndDelete(params);

        if (!hotel) {
            return next(new ErrorResponse(`Hotel with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(201).json({
                success: true,
                status: `DELETED`,
                message: `Hotel deleted successfully with given ID : ${params}`,
                data: hotel,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.findHotels = async function (req, res, next) {
    try {
        const hotel = await Hotel.find();

        if (!hotel) {
            return next(new ErrorResponse(`There are no hotel documents!`, 404));
        } else {
            await res.status(200).json({
                success: true,
                status: `FOUNDED`,
                message: `All Hotels are found successfully`,
                data: hotel,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.findHotel = async function (req, res, next) {
    const params = req.params.id;
    try {
        const hotel = await Hotel.findById(params);

        if (!hotel) {
            return next(new ErrorResponse(`Hotel with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(200).json({
                success: true,
                status: `FOUNDED`,
                message: `Hotel Founded successfully with given ID : ${params}`,
                data: hotel,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.countByCity = async function (req, res, next) {
    const cities = req.query.cities.split(",");

    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({city: city});
        }));

        await res.status(200).json({
            success: true,
            status: `QUERIED`,
            message: `Query results are found successfully! Query: ${cities}`,
            data: list,
        });
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.countByType = async function (req, res, next) {
    const types = req.query.types.split(",");

    try {
        const list = await Promise.all(types.map(type => {
            return Hotel.countDocuments({type: type});
        }));

        await res.status(200).json({
            success: true,
            status: `QUERIED`,
            message: `Query results are found successfully! Query: ${types}`,
            data: list,
        });
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}