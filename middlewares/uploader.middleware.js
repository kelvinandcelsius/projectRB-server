import pkg from 'cloudinary'
const { v2: cloudinary } = pkg
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req) => {
        let folderName = "ProjectRB"
        if (req.route.path === "/avatar") {
            folderName = "avatars"
        } else if (req.route.path === "/company-logo") {
            folderName = "company_logos"
        }
        return { folder: folderName }
    },
})

export default multer({ storage })
