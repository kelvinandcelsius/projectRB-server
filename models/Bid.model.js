import mongoose from "mongoose"
const { Schema, model } = mongoose

const bidSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Broker',
        required: false
    },
    lead: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: false
    },
    offerPrice: {
        type: Number,
        required: true
    },
    message: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    accepted: {
        type: Boolean,
        required: true,
        default: false
    }
})

export default model("Bid", bidSchema)