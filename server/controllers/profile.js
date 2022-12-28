const Profiles = require('../models/Profile.js');
const ErrorResponse = require("../utils/errorResponse.js");

module.exports.findProfile = async function (req, res, next) {
        // Profiles.populate('profile.fiance')
    const { altid } = req.user;
    const profile = await Profiles.findOne({ altid })

    try {
    res.status(200).json({ success: true, status: `RECEIVED`, message: `Get Operation & Responses Delivered successfully!`, data: profile });

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
    
}

module.exports.findProfileByUsername = async function (req, res, next) {

        // Profiles.populate('bio.partner')
    const params = req.params.username;
    const profile = await Profiles.findOne({ username: params });
    
    try {
    
    if (!profile) {
        return next(new ErrorResponse(`Parameters of Username: [${params}] you given not found!`, 404));
        }

        res.status(200).json({ success: true, status: `RECEIVED`, message: `Get Operation & Responses ByUsername Delivered successfully!`, data: profile });

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.writeProfile = async function (req, res, next) {

    const { altid } = req.user;

    try {

    if (!req.body) {
        return next(new ErrorResponse(`Please provide a detail of your target profile!`, 400));
    }

    const request = await setProps(req.body, altid);

    const profile = await Profiles.findOneAndUpdate({ altid },{ $set: request}, { new: true });

    function setProps(request, id) {
        request.altid = id;
        request.fullname = `${request.firstname} ${request.middlename} ${request.lastname}`;

        return request;
    }
    
    res.status(201).json({
        success: true,
        status: `WRITTEN`,
        message: `Post Operation & Responses Delivered successfully!`,
        data: profile
    });

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

module.exports.updateProfile = async function (req, res, next) { 
    const { altid } = req.user;
    await Profiles.findOneAndUpdate({ altid } , { $set: req.body }, { new: true })
        .then(profiles => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: `UPDATED`, message: `Update Operation is completed successfully!`, data:profiles });
        })
        .catch(err =>next(err));
}

module.exports.clearProfile = async function (req, res, next) {

    const { altid, username } = req.user;

    await Profiles.findOneAndDelete({ altid })
        .then(profile => {
            console.log('Delete Operation is completed successfully! \n', profile);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ 
                success: true, 
                status: `CLEARED`, 
                message: `Delete Operation is completed successfully! Ensure that you can't get it back!`,
                data: profile,
            });
        })
        .catch(err =>next(err));

    await Profiles.create({ altid, username })
        .then(profiles => {
            console.log('Create Operation is completed successfully! \n', profiles);
        })
        .catch(err =>next(err));
}

module.exports.updateProfileByUsername = async function (req, res, next) { // Admin Only
    const params = req.params.username;
    const profile = await Profiles.findOneAndUpdate({ username: params } , { $set: req.body }, { new: true });

    try {

        if (!profile) {
            return next(new ErrorResponse(`Parameters of Username: [${params}] you given not found!`, 404));
        }

        await res.status(201)
            .setHeader('Content-Type', 'application/json')
            .json({
                success: true, status: `UPDATED`,
                message: `Update Operation byUsername is completed successfully!`, 
                data: profile
            });

    } catch (error) {
        consolelog(`Error: ${error}`);
        next(error);
    }
}

module.exports.deleteProfileByUsername = async function (req, res, next){   // Admin Only
    const params = req.params.username;
    const profile = await Profiles.findOneAndDelete({ username: params });

    try {
        if (!profile) {
            return next(new ErrorResponse(`Parameters of Username: [${params}] you given not found!`, 404));
        }

        console.log('Delete Operation is completed successfully! \n', profile);

        await res.status(201)
            .setHeader('Content-Type', 'application/json')
            .json({ success: true, status: `DELETED`, 
                data: `Delete Operation byUsername is completed successfully! Ensure that you can't get it back!
                : ${profile}`
            });

    } catch (error) {
        consolelog(`Error: ${error}`);
        next(error);
    }
}