import mongoose from "mongoose"
const { Schema, model } = mongoose

const clientSchema = new Schema({

    identity: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    prospectCompanies: [{
        type: Schema.Types.ObjectId,
        ref: 'InsuranceCompany',
    }],
    policies: [{
        type: Schema.Types.ObjectId,
        ref: 'Policy',
        required: false,
    }],

})

export default model("Client", clientSchema)