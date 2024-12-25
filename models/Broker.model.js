import mongoose from "mongoose"
const { Schema, model } = mongoose

const brokerSchema = new Schema({

    identity: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    insuranceCompany: {
        type: Schema.Types.ObjectId,
        ref: 'InsuranceCompany',
        required: false
    },
    incomingQuotes: [{
        type: Schema.Types.ObjectId,
        ref: 'QuoteRequest',
        required: false
    }],
    bids: [{
        type: Schema.Types.ObjectId,
        ref: 'Bid',
        required: false
    }],
    //datos broker dashboard
    // grossEarnings: {
    //     type: Number,
    //     required: false,

    //     comission: {
    //         type: Number,
    //         required: false

    //     },
    //     earnedAt: {
    //         type: Date,
    //         required: false
    //     }
    // },

    claseDeMediador: {
        type: String,
        required: false
    },
    autoridadDeControl: {
        type: String,
        required: false
    },
    claveDeInscripcion: {
        type: String,
        unique: true,
        required: false,
        // validate: { //C003148001437T
        //     validator: function (v) {
        //         const regex = /^[A-Za-z]\d{12}[A-Za-z]$/
        //         if (!regex.test(v)) {
        //             return false
        //         }
        //         const codeNoLetters = v.slice(1, -1)
        //         const possibleLetters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ'
        //         const endLetter = parseInt(codeNoLetters) % possibleLetters.length
        //         const calcLetter = possibleLetters.charAt(endLetter)

        //         return calcLetter === v.slice(-1)
        //     },
        //     message: props => `${props.value} not a valid license number`
        // }
    },
    fechaDeInscripcion: {
        type: Date,
        required: false
    },
    razonSocial: {
        type: String,
        unique: true,
        required: false
    },
    cifIdentificacion: {
        type: String,
        unique: true,
        required: false,
        // validate: {
        //     validator: function (v) {
        //         const regex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/
        //         if (!regex.test(v)) {
        //             return false;
        //         }

        //         const cifNumbers = v.slice(1, -1)
        //         const letrasCIF = 'JABCDEFGHI'
        //         const indice = cifNumbers % 10
        //         const letraCalculada = letrasCIF.charAt(indice)

        //         return letraCalculada === v.slice(-1)
        //     },
        //     message: props => `${props.value} is not a valid CIF`
        // }
    },
    ambitoDeOperacion: {
        type: String,
        required: false
    },
    autorizadaPorOtraEntidadAseguradora: {
        type: Boolean,
        required: false
    },
    complementario: {
        type: Boolean,
        required: false
    },
    agenteDeGrupo: {
        type: Boolean,
        required: false
    },
    billingAddress: {
        type: String,
        required: false,
    },
    postcode: {
        type: Number,
        required: false,
        validate: {
            validator: function (v) {
                return /^\d{5}$/.test(v.toString())
            },
            message: props => `${props.value} is not a valid Spanish postal code. It must have 5 digits.`
        }
    },
    townCity: { type: String, required: false },
    provincia: { type: String, required: false },
    country: { type: String, required: false },
    website: {
        type: String,
        required: false
    }
})

export default model("Broker", brokerSchema)