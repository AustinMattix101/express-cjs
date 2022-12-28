const Task = require("../models/Task.js");
const ErrorResponse = require("../utils/errorResponse.js");

module.exports.postTask = async function (req, res, next) {
    const { username } = req.user;

    function setProps(request, username) {
        request.postBy = username;

        return request;
    }

    try {
        if (!req.body) {
            return next(new ErrorResponse(`Please provide a detail of your target Task!`, 400));
        }
        const request = setProps(req.body, username);
        const task = new Task(request);
        const data = await task.save();

        await res.status(201).json({
            success: true,
            status: `CREATED`,
            message: `Task created successfully with Username : ${username}`,
            data: data,
        });
    } catch (error) {
        next(new ErrorResponse(`Something went wrong on create a new Task! Error: ${error}`, 400));
    }
}

module.exports.updateTask = async function (req, res, next) {
    const params = req.params.id;
    const request = req.body;
    try {
        const task = await Task.findByIdAndUpdate(params, { $set: request}, {new: true});

        if (!task) {
            return next(new ErrorResponse(`Task with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(201).json({
                success: true,
                status: `UPDATED`,
                message: `Task updated successfully with given ID : ${params}`,
                data: task,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.deleteTask = async function (req, res, next) {
    const params = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(params);

        if (!task) {
            return next(new ErrorResponse(`Task with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(201).json({
                success: true,
                status: `DELETED`,
                message: `Task deleted successfully with given ID : ${params}`,
                data: task,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.findTasks = async function (req, res, next) {
    try {
        const tasks = await Task.find();

        if (!tasks) {
            return next(new ErrorResponse(`There are no task documents!`, 404));
        } else {
            await res.status(200).json({
                success: true,
                status: `FOUNDED`,
                message: `All Tasks are found successfully!`,
                data: tasks,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.findTask = async function (req, res, next) {
    const params = req.params.id;
    try {
        const task = await Task.findById(params);

        if (!task) {
            return next(new ErrorResponse(`Task with given ID: [${params}] not found!`, 400));
        } else {
            await res.status(200).json({
                success: true,
                status: `FOUNDED`,
                message: `Task Founded successfully with given ID : ${params}`,
                data: task,
            });
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}