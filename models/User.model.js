import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Schema, model } from "mongoose"

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, 'The email is required']
  },
  phone: {
    type: String,
    unique: true,
    required: false
  },
  password: {
    type: String,
    required: [true, 'the password is required'],
    minlength: [3, 'The password is too short'],
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  dob: {
    type: Date,
    required: false
  },
  govId: {
    type: String,
    unique: true,
    sparse: true,
    required: false,
    validate: {
      validator: function (v) {
        const dniRegex = /^\d{8}[A-Za-z]$/
        const nieRegex = /^[XYZ]\d{7}[A-Z]$/

        if (dniRegex.test(v)) {

          const dniNumbers = v.slice(0, -1)
          const letrasDNI = 'TRWAGMYFPDXBNJZSQVHLCKE'
          const indice = dniNumbers % 23
          const letraCalculada = letrasDNI.charAt(indice)

          return letraCalculada === v.slice(-1).toUpperCase()
        }

        else if (nieRegex.test(v)) {

          const nieNumbers = v.slice(1, -1)
          const letrasNIE = 'TRWAGMYFPDXBNJZSQVHLCKE'
          const indice = nieNumbers % 23
          const letraCalculada = letrasNIE.charAt(indice)

          return letraCalculada === v.slice(-1)
        } else {
          return false
        }
      },
      message: props => `${props.value} is not a valid NIE or DNI`
    }
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://medvirturials.com/img/default-image.png'
  },
  role: {
    type: String,
    enum: ['ADMIN', 'BROKER', 'CLIENT'],
    default: 'CLIENT'
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: function () { return this.role === 'CLIENT' }
  },
  brokerId: {
    type: Schema.Types.ObjectId,
    ref: 'Broker',
    required: function () { return this.role === 'BROKER' }
  }
}, {
  timestamps: true
})

userSchema.pre('save', function (next) {

  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(this.password, salt)
  this.password = hashedPassword
  next()
})

userSchema.methods.signToken = function () {
  const { _id, email, role } = this
  const payload = { _id, email, role }

  const authToken = jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { algorithm: 'HS256', expiresIn: "6h" }
  )
  return authToken
}

userSchema.methods.validatePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password)
}

export default model("User", userSchema)