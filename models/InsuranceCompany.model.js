import mongoose from "mongoose"
const { Schema, model } = mongoose

const insuranceCompanySchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },

    logo: {
        type: String,
        required: true,
        default: 'https://www.8countsheets.com/images/default-logo.png'
    },

})

export default model("InsuranceCompany", insuranceCompanySchema)