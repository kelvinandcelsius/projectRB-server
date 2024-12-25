const imageRoute = (req, res) => {

    if (!req.file) {
        res.status(500).json({ errorMessage: 'Error uploading' })
        return
    }

    res.json({ cloudinary_url: req.file.path })
}


export { imageRoute }