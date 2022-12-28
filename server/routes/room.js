const { protect, AdminProtect } = require("../middlewares/auth.js");
const { corsWithOptions } = require("../middlewares/cors.js");
const { Router} = require("express");
const roomRouter = Router();

const { // Room
    postRoom,
    updateRoom,
    deleteRoom,
    findRooms,
    findRoom,
} = require("../controllers/room.js");

    // Room
roomRouter
    .route('/:hotelid')
    .options(corsWithOptions)
    .post(protect, postRoom);

roomRouter
    .route('/:id')
    .options(corsWithOptions)
    .put(protect, updateRoom);

roomRouter
    .route('/:id/:hotelid')
    .options(corsWithOptions)
    .delete(protect, deleteRoom);

roomRouter
    .route('/')
    .options(corsWithOptions)
    .get(protect, findRooms);

roomRouter
    .route('/:id')
    .options(corsWithOptions)
    .get(protect, findRoom);

module.exports = roomRouter;
