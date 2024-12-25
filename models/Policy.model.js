import mongoose from "mongoose"
const { Schema, model } = mongoose

const policySchema = new Schema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },

    key: {
        type: String,
        // required: true
        required: false
    },

    tomador: {
        type: String,
        required: false
    },

    asegurado: {
        type: String,
        required: false
    },

    policyCompany: {
        type: String,
        required: false
    },
    expiry: {
        type: Date,
        required: false
    },
    policyType: {
        type: String,
        required: false
    },
    coverage: {
        type: String,
        required: false
    },
    premium: {
        type: Number,
        required: false
    },
    quoteRequestId: {
        type: Schema.Types.ObjectId,
        ref: 'QuoteRequest',
        required: false,
    }
})

export default model("Policy", policySchema)