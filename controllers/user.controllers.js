import User from "../models/User.model.js"
import bcrypt from 'bcryptjs'

const getAllUsers = (req, res, next) => {

    User
        .find()
        .select({ username: 1, avatar: 1, role: 1, _id: 1, firstName: 1, lastName: 1 })
        .then(response => res.json(response))
        .catch(err => next(err))
}

const getOneUser = (req, res, next) => {
    const { id } = req.params

    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            let query = User.findById(id).select('-password')

            if (user.role === 'CLIENT') {
                query = query.populate({
                    path: 'clientId',
                    populate: [
                        { path: 'prospectCompanies' },
                        { path: 'policies' }
                    ]
                })
            } else if (user.role === 'BROKER') {
                query = query.populate({
                    path: 'brokerId',
                    populate: [
                        { path: 'insuranceCompany' },
                        {
                            path: 'incomingQuotes',
                            populate: {
                                path: 'policyId',
                                populate: {
                                    path: 'owner',
                                    populate: {
                                        path: 'identity'
                                    }
                                }
                            }
                        },
                    ]
                })
            }

            return query.exec()
        })
        .then(user => res.json(user))
        .catch(err => next(err))
}

const editOneUser = async (req, res) => {
    const { id } = req.params
    let updateData = req.body

    delete updateData.govId
    delete updateData.role

    try {
        let user = await User.findById(id)

        if (user.role === 'CLIENT') {
            user = await user.populate({
                path: 'clientData',
                populate: ['prospectCompanies', 'policies']
            }).execPopulate()
            if (updateData.clientData) {
                await Client.findByIdAndUpdate(user.clientData._id, updateData.clientData, { runValidators: true, new: true })
            }
        } else if (user.role === 'BROKER') {
            user = await user.populate({
                path: 'brokerData',
                populate: ['insuranceCompany']
            }).execPopulate()
            if (updateData.brokerData) {
                const brokerUpdateData = updateData.brokerData
                delete brokerUpdateData.insuranceCompany
                await Broker.findByIdAndUpdate(user.brokerData._id, brokerUpdateData, { runValidators: true, new: true })
                if (updateData.brokerData.insuranceCompany) {
                    await InsuranceCompany.findByIdAndUpdate(user.brokerData.insuranceCompany, updateData.brokerData.insuranceCompany, { runValidators: true, new: true })
                }
            }
        }

        if (updateData.password) {
            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(updateData.password, salt)
            updateData.password = hashedPassword
        }

        await User.findByIdAndUpdate(id, { $set: updateData }, { runValidators: true, new: true })
        res.sendStatus(204)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Error updating user' })
    }
}

const deleteOneUser = async (req, res) => {

    const { id } = req.params

    try {
        const user = await User.findById(id)
        if (user.role === 'CLIENT') {
            await Policy.deleteMany({ owner: user.clientData })
            await Client.findByIdAndDelete(user.clientData)
        } else if (user.role === 'BROKER') {
            await Broker.findByIdAndDelete(user.brokerData)
        }
        await user.remove()
        res.sendStatus(204)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Error deleting user' })
    }
}

export {
    getAllUsers,
    getOneUser,
    editOneUser,
    deleteOneUser
}