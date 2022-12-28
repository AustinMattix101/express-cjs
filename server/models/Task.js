const { Schema, model } = require("mongoose");

const TaskSchema = new Schema({
    text: String,
    day: String,
    reminder: {
        type: Boolean,
        default: false
    },
    postBy: {
        type: String,
        required: [true, " Please povide who post this task! "],
    },
}, { timestamps: true });

const Task = model("Tasks", TaskSchema);
module.exports = Task;