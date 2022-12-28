module.exports.getPrivateData = function (req, res, next) {
    res.status(200).json({
        success: true,
        status: `ACCESSED`,
        message: "You got access to the private data in this route."
    });
}