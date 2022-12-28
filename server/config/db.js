const mongoose = require("mongoose");
const figlet = require("figlet");
const { success, error, notice, warn, pink } = require("../index");

async function connectDB() {
    const uri = process.env.MONGO_URI;

    try {
        const data = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }); // Use then here!
        figlet('MATTIX', function (err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(pink.blink(data));
        });
        console.log(pink.bgWhite.bold.italic("Connected Successfully to The Database!"));
        console.log(notice.bgWhite.bold(`Database Connected to ${data.connection.host}:${data.connection.port}`));
        // console.log('Connection Details: \n', data);
    
        await mongoose.connection.on('disconnected', () => {
            console.log(error(`Database Disconnected!`));
        });
    
        await mongoose.connection.on('connected', () => {
            console.log(notice(`Database Reconnected!`));
        });

    } catch (error) {
        console.log(error(`Error: ${error}`));
        next(error);
    }
}

module.exports = connectDB;