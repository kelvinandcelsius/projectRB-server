import mongoose from "mongoose"
const { Schema, model } = mongoose

const quoteRequestSchema = new Schema({
    policyId: {
        type: Schema.Types.ObjectId,
        ref: 'Policy',
        required: true
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
    receivedBids: [{
        type: Schema.Types.ObjectId,
        ref: 'Bid',
        required: false
    }],
    winningBid: {
        type: Schema.Types.ObjectId,
        ref: 'Bid',
        required: false
    }
})

export default model("QuoteRequest", quoteRequestSchema)

