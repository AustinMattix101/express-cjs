module.exports.postUpload = async function (req, res) {
    try {
    await res.status(201)
        .setHeader("Content-Type", "application/json")
        .json({
            data: {
                file: req.file,
                files: req.files
            }
        });
    } catch (error) {
        console.log(`Error: `, error);
        next(error);
    }
}