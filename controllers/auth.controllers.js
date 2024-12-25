import mongoose from 'mongoose'
import User from '../models/User.model.js'
import Broker from '../models/Broker.model.js'
import Client from '../models/Client.model.js'
import { handleDuplicateKeyError } from '../helpers/duplicate-key-error-handler.js'

const signUp = async (req, res, next) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    const { email, password, phone, role, avatar, firstName, lastName, brokerData } = req.body
    let userRoleObj
    let brokerId
    let clientId
    let user

    try {

        if (role === 'BROKER') {
            [userRoleObj] = await Broker.create([{ ...brokerData }], { session })
            brokerId = userRoleObj._id
        }
        if (role === 'CLIENT') {
            [userRoleObj] = await Client.create([{}], { session })
            clientId = userRoleObj._id
        }

        const userCreationData = { email, password, phone, role, avatar, firstName, lastName, verified: false }
        if (brokerId) {
            userCreationData.brokerId = brokerId
        }
        if (clientId) {
            userCreationData.clientId = clientId
        }
        [user] = await User.create([userCreationData], { session })

        if (role === 'BROKER') {
            await Broker.findByIdAndUpdate(brokerId, { identity: user._id }, { session })
        } else if (role === 'CLIENT') {
            await Client.findByIdAndUpdate(clientId, { identity: user._id }, { session })
        }

        await session.commitTransaction()
        session.endSession()

        const userResponse = { email: user.email, _id: user._id, phone: user.phone, role: user.role, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, clientId, brokerId }
        res.status(201).json({ user: userResponse })

    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction()
        }
        session.endSession()

        if (userRoleObj && !user) {
            if (role === 'BROKER') {
                await Broker.findByIdAndDelete(brokerId)
            } else if (role === 'CLIENT') {
                await Client.findByIdAndDelete(clientId)
            }
        }
        handleDuplicateKeyError(err, req, res, next)
    }
}

const logIn = (req, res, next) => {

    const { email, password } = req.body

    if (email === '' || password === '') {
        res.status(400).json({ message: "provide_email_and_password" })
        return
    }

    User
        .findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                res.status(401).json({ field: "email", message: "email_not_found" })
                return
            }

            if (foundUser.validatePassword(password)) {
                const authToken = foundUser.signToken()
                const userRole = foundUser.role
                res.json({ authToken, role: userRole })
            }
            else {
                res.status(401).json({ field: "password", message: "wrong_password" })
            }
        })
        .catch(err => next(err))
}

const verify = (req, res, next) => {
    res.status(200).json(req.payload)
}

export { signUp, logIn, verify }