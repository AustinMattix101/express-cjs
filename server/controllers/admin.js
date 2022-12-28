module.exports.getAdminData = function (req, res, next) {
    res.status(200).json({
        success: true,
        status: `ACCESSED`,
        message: "You got access to the admin data in this route."
    });
}