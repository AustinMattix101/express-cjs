const { Schema, model } = require("mongoose");

const RoomSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true,
    },
    roomNumbers: [
        { number: Number, unavailableDates: [{ type: Date }] }
    ],
    postBy: {
        type: String,
        required: [true, " Please povide who post this Room! "],
    },
}, { timestamps: true });

// {number:101, unavailableDates:{05.12.2022, 06.12.2022}},
const Room = model("Room", RoomSchema);
module.exports = Room;