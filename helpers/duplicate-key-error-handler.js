export const handleDuplicateKeyError = (err, req, res, next) => {

    if (err.code === 11000 && err.keyPattern) {

        const field = Object.keys(err.keyPattern)[0]
        const message = `${field}_already_exists`

        console.log("field SERVER:", field, "message SERVER:", message)

        return res.status(409).json({
            error: "Conflict",
            field: field,
            message
        })
    } else {
        next(err)
    }
}