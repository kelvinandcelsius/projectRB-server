import { Schema, model } from "mongoose"

const userVerificationSchema = new Schema({
    userID: {
        type: String
    },
    uniqueString: {
        type: String
    },
    createdAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
})



export default model("UserVerification", userVerificationSchema)