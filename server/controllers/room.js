const Hotel = require("../models/Hotel.js");
const Room = require("../models/Room.js");
const ErrorResponse = require("../utils/errorResponse.js");

module.exports.postRoom = async function (req, res, next) {
    const { username } = req.user;
    const params = req.params.hotelid;

    function setProps(request, username) {
        request.postBy = username;

        return request;
    }

    try {
        const request = setProps(req.body, username);
        const room = new Room(request);

        const data = await room.save();

        try {
            await Hotel.findByIdAndUpdate(params, {$push: {rooms: room._id }});

            await res.status(201).json({
                success: true,
                status: `CREATED`,
                message: `Rooom created successfully with given Hotel ID : ${params}`,
                data: data,
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            next(new ErrorResponse(`Something went wrong on create a new room! Error: ${error}`, 400));
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.updateRoom = async function (req, res, next) {
    const params = req.params.id;
    const request = req.body;
    try {
        const room = await Room.findByIdAndUpdate(params, { $set: request}, {new: true});

        if (!room) {
            return next(new ErrorResponse(`Room with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(201).json({
                success: true,
                status: `UPDATED`,
                message: `Room updated successfully with given ID : ${params}`,
                data: room,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.deleteRoom = async function (req, res, next) {
    const hotelid = req.params.hotelid;
    const params = req.params.id;
    try {
        const room = await Room.findByIdAndDelete(params);

        if (!room) {
            return next(new ErrorResponse(`Room with given ID: [${params}] not found!`, 400));
        } else {
            await Hotel.findByIdAndUpdate(hotelid, {$pull: {rooms: params }});

            await res.status(201).json({
                success: true,
                status: `DELETED`,
                message: `Room deleted successfully with given ID : ${params}`,
                data: room,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.findRooms = async function (req, res, next) {
    try {
        const room = await Room.find();

        if (!room) {
            return next(new ErrorResponse(`There are no room documents`, 404));
        } else {
            await res.status(200).json({
                success: true,
                status: `FOUNDED`,
                message: `All Rooms are found successfully`,
                data: room,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.findRoom = async function (req, res, next) {
    const params = req.params.id;
    try {
        const room = await Room.findById(params);

        if (!room) {
            return next(new ErrorResponse(`Room with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(200).json({
                success: true,
                status: `FOUNDED`,
                message: `Room Founded successfully with given ID : ${params}`,
                data: room,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}