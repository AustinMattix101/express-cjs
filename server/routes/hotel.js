const { protect, AdminProtect } = require("../middlewares/auth.js");
const { corsWithOptions } = require("../middlewares/cors.js");
const { Router } = require("express");
const hotelRouter = Router();

const {  // Hotel
    postHotel, 
    updateHotel,
    deleteHotel,
    findHotels,
    findHotel,
    countByCity,
    countByType
} = require("../controllers/hotel.js");

    // Hotel
hotelRouter
    .route('/')
    .options(corsWithOptions)
    .post(protect, AdminProtect, postHotel);

hotelRouter
    .route('/:id')
    .options(corsWithOptions)
    .put(protect, AdminProtect, updateHotel);

hotelRouter
    .route('/:id')
    .options(corsWithOptions)
    .delete(protect, AdminProtect, deleteHotel);

hotelRouter
    .route('/')
    .options(corsWithOptions)
    .get(protect, findHotels);

hotelRouter
    .route('/find/:id')
    .options(corsWithOptions)
    .get(protect, findHotel);

    // Hotel Query
hotelRouter
    .route('/countByCity')
    .options(corsWithOptions)
    .get(protect, countByCity);

hotelRouter
    .route('/countByType')
    .options(corsWithOptions)
    .get(protect, countByType);

module.exports = hotelRouter;
