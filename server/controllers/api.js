module.exports.getAPI = function (req, res) {
    res.status(200).json({ message: `Welcome to Camunited API` });
}

module.exports.getCamunitedAPI = function (req, res) {
    res.status(200).json({
        message: `Welcome to Camunited Team API! ;)`
    })
}