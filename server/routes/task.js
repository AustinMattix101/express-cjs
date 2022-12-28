const { protect, AdminProtect } = require("../middlewares/auth.js");
const { corsWithOptions } = require("../middlewares/cors.js");
const { Router} = require("express");
const taskRouter = Router();

const { // Tasks
    postTask,
    updateTask,
    deleteTask,
    findTasks,
    findTask,
} = require("../controllers/task.js");

    // Tasks
taskRouter
    .route('/')
    .options(corsWithOptions)
    .post(protect, postTask);

taskRouter
    .route('/:id')
    .options(corsWithOptions)
    .put(protect, updateTask);

taskRouter
    .route('/:id')
    .options(corsWithOptions)
    .delete(protect, deleteTask);

taskRouter
    .route('/')
    .options(corsWithOptions)
    .get(protect, findTasks);

taskRouter
    .route('/:id')
    .options(corsWithOptions)
    .get(protect, findTask);

module.exports = taskRouter;