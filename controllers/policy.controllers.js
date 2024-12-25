import mongoose from 'mongoose'
import Policy from '../models/Policy.model.js'
import User from '../models/User.model.js'
import Client from '../models/Client.model.js'
import QuoteRequest from '../models/QuoteRequest.model.js'
import { generateUploadUrl, analyzeText } from '../middlewares/gcs.middleware.js'

const uploadPolicy = (req, res) => {

    const { _id: owner } = req.payload
    const { fileName } = req.body
    const key = `${owner}-${fileName.replace(/[. ]/g, '').trim()}`

    req.key = key

    generateUploadUrl(process.env.GCS_BUCKET_NAME, key)
        .then(presignedUrl => {

            Policy
                .create({ owner, key })
                .then(policy => {
                    return User.findByIdAndUpdate(owner, { $push: { policy: policy._id } }, { new: true })
                })
                .then(() => res.status(201).json({ presignedUrl, owner, key, message: 'Policy uploaded successfully' })
                )
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Error saving policy', err })
        })
}

const analyzePolicy = (req, res) => {

    const key = req.params.key

    analyzeText(process.env.GCS_BUCKET_NAME, key)
        .then(result => {
            res.status(200).json({ message: 'File analyzed successfully', data: result });
        })
        .catch(err => {
            console.error('Error analyzing policy:', err)
            if (err.statusDetails && err.statusDetails.length > 0 && err.statusDetails[0].fieldViolations) {
                console.error('Field violations:', err.statusDetails[0].fieldViolations);
            }
            res.status(500).json({ message: 'Error analyzing policy', error: err });
        })
}

const createPolicy = async (req, res) => {

    const session = await mongoose.startSession()

    try {
        session.startTransaction()
        const { _id } = req.payload
        const { policyCompany, policyType, expiry, premium } = req.body
        const key = `${_id}-${policyType.replace(/[. ]/g, '').trim()}`

        req.key = key

        const user = await User.findById(_id).session(session)
        const clientId = user.clientId
        const [policy] = await Policy.create([{ owner: clientId, key, policyCompany, policyType, expiry, premium }], { session })

        await Client.findByIdAndUpdate(clientId, { $push: { policies: policy._id } }, { new: true, session })

        const [quoteRequest] = await QuoteRequest.create([{ policyId: policy._id }], { session })

        await Policy.findByIdAndUpdate(policy._id, { quoteRequestId: quoteRequest._id }, { session })

        await session.commitTransaction()

        res.status(201).json({ policy, quoteRequest, message: 'Policy and quoteRequest created successfully' })

    } catch (err) {
        await session.abortTransaction();
        console.error("createPolicy error", err)
        res.status(500).json({ errorMessage: 'Error creating policy', error: err.message })
    } finally {
        session.endSession()
    }
}

const getOnePolicy = (req, res, next) => {
    const { } = req.params


}

// const getAllPolicies = (req, res, next) => {
//     const { id } = req.params
//     User
//         .findById(id)
//         .populate('policy')
//         .then(response => {

//             const promises = response.policy.map(policy => {
//                 const command = new GetObjectCommand({
//                     Bucket: process.env.AWS_S3_BUCKET_NAME,
//                     Key: policy.key,
//                 })
//                 return getSignedUrl(s3, command, { expiresIn: 3600 })
//                     .then(presignedUrl => {
//                         return { ...policy._doc, presignedUrl }
//                     })
//             })

//             return Promise.all(promises)
//         })
//         .then(policies => {
//             res.json(policies)
//         })
//         .catch(err => next(err))
// }



export {
    uploadPolicy,
    analyzePolicy,
    createPolicy
}